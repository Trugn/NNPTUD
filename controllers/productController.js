const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .populate('user', 'name email');

        res.json({
            message: 'Products retrieved successfully',
            data: products,
            count: products.length,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('category', 'name description')
            .populate('user', 'name email avatar');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            message: 'Product retrieved successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const products = await Product.find({ category: categoryId })
            .populate('category', 'name')
            .populate('user', 'name email');

        res.json({
            message: 'Products retrieved successfully',
            data: products,
            count: products.length,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, inventory, category } = req.body;

        // Validate required fields
        if (!name || !description || !price || inventory === undefined || !category) {
            return res.status(400).json({
                error: 'Name, description, price, inventory, and category are required',
            });
        }

        // Check if product name already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(409).json({ error: 'Product name already exists' });
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Validate price and inventory
        if (price <= 0) {
            return res.status(400).json({ error: 'Price must be greater than 0' });
        }

        if (inventory < 0) {
            return res.status(400).json({ error: 'Inventory cannot be negative' });
        }

        const productData = {
            name,
            description,
            price: parseFloat(price),
            inventory: parseInt(inventory),
            category,
            user: req.userId,
        };

        // Handle image upload
        if (req.file) {
            productData.image = `/uploads/products/${req.file.filename}`;
        }

        const product = new Product(productData);
        await product.save();

        // Populate references before sending response
        await product.populate('category', 'name');
        await product.populate('user', 'name email');

        res.status(201).json({
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, inventory, category } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if new name already exists (if name is being changed)
        if (name && name !== product.name) {
            const existingProduct = await Product.findOne({ name });
            if (existingProduct) {
                return res.status(409).json({ error: 'Product name already exists' });
            }
            product.name = name;
        }

        // Check if category exists (if category is being changed)
        if (category && category !== product.category.toString()) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ error: 'Category not found' });
            }
            product.category = category;
        }

        // Update other fields
        if (description !== undefined) {
            product.description = description;
        }

        if (price !== undefined) {
            if (price <= 0) {
                return res.status(400).json({ error: 'Price must be greater than 0' });
            }
            product.price = parseFloat(price);
        }

        if (inventory !== undefined) {
            if (inventory < 0) {
                return res.status(400).json({ error: 'Inventory cannot be negative' });
            }
            product.inventory = parseInt(inventory);
        }

        // Handle image upload
        if (req.file) {
            product.image = `/uploads/products/${req.file.filename}`;
        }

        await product.save();

        // Populate references before sending response
        await product.populate('category', 'name');
        await product.populate('user', 'name email');

        res.json({
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            message: 'Product deleted successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add inventory to product
exports.addInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({ error: 'Quantity is required' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const originalInventory = product.inventory;
        product.inventory += parseInt(quantity);
        await product.save();

        // Populate references before sending response
        await product.populate('category', 'name');
        await product.populate('user', 'name email');

        res.json({
            message: 'Inventory added successfully',
            data: {
                product,
                previousInventory: originalInventory,
                addedQuantity: parseInt(quantity),
                newInventory: product.inventory,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Reduce inventory (when product is sold)
exports.reduceInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({ error: 'Quantity is required' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.inventory < quantity) {
            return res.status(400).json({
                error: `Not enough inventory. Available: ${product.inventory}, Requested: ${quantity}`,
            });
        }

        const originalInventory = product.inventory;
        product.inventory -= parseInt(quantity);
        product.sold += parseInt(quantity);
        await product.save();

        // Populate references before sending response
        await product.populate('category', 'name');
        await product.populate('user', 'name email');

        res.json({
            message: 'Inventory reduced successfully',
            data: {
                product,
                previousInventory: originalInventory,
                reducedQuantity: parseInt(quantity),
                newInventory: product.inventory,
                totalSold: product.sold,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
