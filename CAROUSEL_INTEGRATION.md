# 🎠 Carousel CRUD Integration

This document describes the carousel management system integrated into the NHK Dashboard.

## 📁 File Structure

```
src/
├── app/dashboard/carousel/
│   └── page.tsx                    # Main carousel management page
├── components/dashboard/carousel/
│   ├── carousel-list.tsx          # Carousel items table component
│   └── carousel-form.tsx          # Create/edit carousel form
├── hooks/
│   └── use-carousel.ts            # Custom hook for carousel operations
└── lib/
    └── carousel-api.ts            # API service for carousel CRUD
```

## 🚀 Features

### ✅ Implemented Features

1. **Navigation Integration**
   - Added "Carousel" item to the sidebar navigation
   - Uses `images` icon from Phosphor Icons
   - Accessible at `/dashboard/carousel`

2. **Carousel Management Page**
   - List all carousel items in a table format
   - Create new carousel items
   - Edit existing carousel items
   - Delete carousel items
   - Image preview functionality

3. **Form Features**
   - Title field (required)
   - Link field (optional, with URL validation)
   - Image upload with preview
   - Form validation
   - Loading states during operations

4. **API Integration**
   - Full CRUD operations
   - Error handling
   - Loading states
   - Mock API for development

### 🔧 API Endpoints

The system is designed to work with the following API endpoints:

- `GET /carousel` - Get all carousel items
- `GET /carousel/:id` - Get single carousel item
- `POST /carousel` - Create new carousel item
- `PATCH /carousel/:id` - Update carousel item
- `DELETE /carousel/:id` - Delete carousel item
- `GET /carousel/image/:filename` - Get carousel image

## 🎯 Usage

### For Administrators

1. **Access the Carousel Management**
   - Navigate to the dashboard
   - Click on "Carousel" in the sidebar
   - You'll see the carousel management interface

2. **Create a New Carousel Item**
   - Click "Add Carousel Item" button
   - Fill in the title (required)
   - Optionally add a link URL
   - Upload an image
   - Click "Create" to save

3. **Edit Existing Items**
   - Click the edit icon (pencil) next to any item
   - Modify the fields as needed
   - Click "Update" to save changes

4. **Delete Items**
   - Click the delete icon (trash) next to any item
   - Confirm the deletion

### For Developers

#### Adding Real API Integration

1. **Update the API Base URL**
   ```typescript
   // In src/lib/carousel-api.ts
   const API_BASE_URL = 'http://your-api-domain/carousel';
   ```

2. **Add Authentication**
   ```typescript
   // Uncomment and implement authentication headers
   headers: {
     'Authorization': `Bearer ${getAuthToken()}`,
   },
   ```

3. **Remove Mock Implementation**
   ```typescript
   // Replace this line:
   export { carouselApiMock as carouselApi };
   
   // With this:
   export { carouselApi };
   ```

#### Customizing the Interface

1. **Modify the Form Fields**
   - Edit `src/components/dashboard/carousel/carousel-form.tsx`
   - Add new fields as needed
   - Update validation logic

2. **Change the Table Display**
   - Edit `src/components/dashboard/carousel/carousel-list.tsx`
   - Modify columns and data display

3. **Update Styling**
   - Modify Material-UI theme components
   - Update component styles as needed

## 🔒 Security Considerations

1. **Authentication Required**
   - All CRUD operations require admin authentication
   - Implement proper token management
   - Add role-based access control

2. **File Upload Security**
   - Validate file types (images only)
   - Implement file size limits
   - Sanitize uploaded files
   - Store files securely

3. **Input Validation**
   - Validate all form inputs
   - Sanitize user inputs
   - Implement CSRF protection

## 🧪 Testing

### Manual Testing Checklist

- [ ] Navigate to carousel page
- [ ] View existing carousel items
- [ ] Create new carousel item
- [ ] Edit existing carousel item
- [ ] Delete carousel item
- [ ] Test form validation
- [ ] Test image upload
- [ ] Test URL validation
- [ ] Test loading states
- [ ] Test error handling

### API Testing

Use the provided API documentation to test endpoints:

```bash
# Get all carousel items
curl http://localhost:3000/carousel

# Create new item (with authentication)
curl -X POST http://localhost:3000/carousel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Item" \
  -F "link=https://example.com" \
  -F "image=@/path/to/image.jpg"
```

## 🚀 Deployment

1. **Environment Variables**
   ```env
   CAROUSEL_API_URL=http://your-api-domain/carousel
   CAROUSEL_AUTH_TOKEN=your-auth-token
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   npm start
   ```

## 📝 Future Enhancements

1. **Advanced Features**
   - Drag and drop reordering
   - Bulk operations
   - Image cropping/editing
   - Carousel preview

2. **Performance Optimizations**
   - Image optimization
   - Lazy loading
   - Caching strategies

3. **User Experience**
   - Toast notifications
   - Confirmation dialogs
   - Keyboard shortcuts
   - Responsive design improvements

## 🤝 Contributing

When contributing to the carousel feature:

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add appropriate loading states
5. Test thoroughly before submitting

## 📞 Support

For issues or questions about the carousel integration:

1. Check the API documentation
2. Review the error logs
3. Test with the provided mock API
4. Contact the development team 