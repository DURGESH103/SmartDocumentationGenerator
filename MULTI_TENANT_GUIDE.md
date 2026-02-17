# Multi-Tenant Quick Reference

## For Backend Developers

### ✅ DO: Always Filter by workspace_id

```python
# CORRECT ✓
@router.get("/items")
def get_items(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_id = current_user["workspace_id"]
    items = db.query(Item).filter(Item.workspace_id == workspace_id).all()
    return items
```

```python
# WRONG ✗ - Missing workspace_id filter
@router.get("/items")
def get_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()  # Returns ALL users' data!
    return items
```

### ✅ DO: Get workspace_id from JWT Only

```python
# CORRECT ✓
@router.post("/items")
def create_item(
    item_data: ItemCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace_id = current_user["workspace_id"]  # From JWT
    item = Item(workspace_id=workspace_id, **item_data.dict())
    db.add(item)
    db.commit()
    return item
```

```python
# WRONG ✗ - Taking workspace_id from request
@router.post("/items")
def create_item(item_data: ItemCreate, db: Session = Depends(get_db)):
    # NEVER do this - frontend can spoof workspace_id!
    item = Item(workspace_id=item_data.workspace_id, ...)
    db.add(item)
    db.commit()
    return item
```

### ✅ DO: Add workspace_id to New Models

```python
# CORRECT ✓
class NewModel(Base):
    __tablename__ = "new_table"
    id = Column(String, primary_key=True)
    workspace_id = Column(String, index=True, nullable=False)  # Always add this
    # ... other fields
```

### ✅ DO: Require Authentication

```python
# CORRECT ✓
@router.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    # Route requires authentication
    return {"data": "secure"}
```

```python
# WRONG ✗ - No authentication
@router.get("/unprotected")
def unprotected_route():
    # Anyone can access - security risk!
    return {"data": "exposed"}
```

## For Frontend Developers

### ✅ DO: Send JWT Token in Headers

```javascript
// CORRECT ✓
const response = await fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### ❌ DON'T: Send workspace_id from Frontend

```javascript
// WRONG ✗ - Backend ignores this
const response = await fetch('/api/projects', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Project',
    workspace_id: 'abc-123'  // Backend will NOT use this
  })
});
```

### ✅ DO: Handle 401/403 Errors

```javascript
// CORRECT ✓
try {
  const response = await fetch('/api/projects', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) {
    // Token expired or invalid - redirect to login
    navigate('/login');
  }
  if (response.status === 403) {
    // Forbidden - user doesn't have access
    showError('Access denied');
  }
} catch (error) {
  console.error(error);
}
```

## Common Patterns

### Pattern 1: List User's Resources
```python
@router.get("/resources")
def list_resources(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_id = current_user["workspace_id"]
    return db.query(Resource).filter(Resource.workspace_id == workspace_id).all()
```

### Pattern 2: Get Single Resource
```python
@router.get("/resources/{resource_id}")
def get_resource(resource_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_id = current_user["workspace_id"]
    resource = db.query(Resource).filter(
        Resource.id == resource_id,
        Resource.workspace_id == workspace_id  # Security check
    ).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource
```

### Pattern 3: Create Resource
```python
@router.post("/resources")
def create_resource(data: ResourceCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_id = current_user["workspace_id"]
    resource = Resource(
        workspace_id=workspace_id,  # From JWT
        user_id=current_user["id"],
        **data.dict()
    )
    db.add(resource)
    db.commit()
    return resource
```

### Pattern 4: Update Resource
```python
@router.put("/resources/{resource_id}")
def update_resource(resource_id: str, data: ResourceUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_id = current_user["workspace_id"]
    resource = db.query(Resource).filter(
        Resource.id == resource_id,
        Resource.workspace_id == workspace_id  # Verify ownership
    ).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(resource, key, value)
    
    db.commit()
    return resource
```

### Pattern 5: Delete Resource
```python
@router.delete("/resources/{resource_id}")
def delete_resource(resource_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_id = current_user["workspace_id"]
    resource = db.query(Resource).filter(
        Resource.id == resource_id,
        Resource.workspace_id == workspace_id  # Verify ownership
    ).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    db.delete(resource)
    db.commit()
    return {"message": "Resource deleted"}
```

## Security Checklist

Before deploying any new endpoint:

- [ ] Route requires authentication (`Depends(get_current_user)`)
- [ ] workspace_id extracted from JWT (`current_user["workspace_id"]`)
- [ ] All queries filter by workspace_id
- [ ] workspace_id NOT accepted from request body/params
- [ ] 404 returned if resource not found (don't leak existence)
- [ ] No raw SQL without workspace_id filter

## Testing Checklist

For every new endpoint:

- [ ] Test with valid token - should work
- [ ] Test with invalid token - should return 401
- [ ] Test with no token - should return 401
- [ ] Test User A accessing User B's resource - should return 404
- [ ] Test creating resource - should have correct workspace_id
- [ ] Test listing resources - should only return user's resources
