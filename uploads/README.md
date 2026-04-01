# Uploads Directory

This directory stores user-uploaded files, primarily avatars.

## Structure

- `avatars/` - Contains user profile pictures in various formats (JPEG, PNG, GIF, WebP)

## Upload Limits

- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, GIF, WebP

## Cleanup

Old avatars are automatically deleted when users upload new ones, and upon user account deletion.

## Notes

- This folder should be writable by the Node.js process
- In production, consider using cloud storage (AWS S3, Azure Blob, etc.)
