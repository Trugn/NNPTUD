const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active categories
exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json({
      message: 'Active categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ error: 'Category already exists' });
    }

    const categoryData = {
      name,
      description: description || '',
    };

    // Handle image upload
    if (req.file) {
      categoryData.image = `/uploads/categories/${req.file.filename}`;
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if new name already exists (if name is being changed)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(409).json({ error: 'Category name already exists' });
      }
      category.name = name;
    }

    if (description !== undefined) {
      category.description = description;
    }

    // Handle image upload
    if (req.file) {
      category.image = `/uploads/categories/${req.file.filename}`;
    }

    await category.save();

    res.json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      message: 'Category deleted successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle category status (Admin only)
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      message: 'Category status updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
