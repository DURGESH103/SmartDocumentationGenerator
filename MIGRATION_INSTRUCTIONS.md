# Migration Instructions - Multi-Tenant Setup

## Prerequisites
- Backend server stopped
- Database backup created (recommended)
- Python environment activated

## Step-by-Step Migration

### Step 1: Backup Database (Recommended)
```bash
# For SQLite
cp backend/smartdoc.db backend/smartdoc.db.backup

# For PostgreSQL
pg_dump smartdoc > smartdoc_backup.sql
```

### Step 2: Run Migration Script
```bash
cd backend
python migrate_workspace.py
```

Expected output:
```
✓ Added workspace_id to projects table
✓ Added workspace_id to documentations table
✓ Migration completed successfully
```

### Step 3: Verify Migration
```bash
# Check if columns were added
sqlite3 smartdoc.db "PRAGMA table_info(projects);"
sqlite3 smartdoc.db "PRAGMA table_info(documentations);"
```

You should see `workspace_id` column in both tables.

### Step 4: Start Backend Server
```bash
cd backend
uvicorn app.main:app --reload
```

### Step 5: Test Multi-Tenancy

#### Test 1: Register Two Users
```bash
# Register User A
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User A","email":"usera@test.com","password":"password123"}'

# Register User B
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User B","email":"userb@test.com","password":"password123"}'
```

#### Test 2: Login and Get Tokens
```bash
# Login as User A
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@test.com","password":"password123"}'

# Save the access_token as TOKEN_A

# Login as User B
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"userb@test.com","password":"password123"}'

# Save the access_token as TOKEN_B
```

#### Test 3: Verify Isolation
```bash
# User A uploads a project
curl -X POST http://localhost:8000/api/upload/zip \
  -H "Authorization: Bearer TOKEN_A" \
  -F "file=@project.zip"

# Save the project_id from response

# User A can see their projects
curl -X GET http://localhost:8000/api/projects \
  -H "Authorization: Bearer TOKEN_A"
# Should return User A's projects

# User B cannot see User A's projects
curl -X GET http://localhost:8000/api/projects \
  -H "Authorization: Bearer TOKEN_B"
# Should return empty list (User B has no projects)

# User B tries to access User A's project directly
curl -X GET http://localhost:8000/api/projects/PROJECT_ID_FROM_USER_A \
  -H "Authorization: Bearer TOKEN_B"
# Should return 404 Not Found ✓
```

### Step 6: Handle Existing Data (If Any)

If you have existing projects/docs in the database:

```sql
-- Check existing data
SELECT id, project_name, workspace_id FROM projects;

-- Existing data will have workspace_id = 'legacy_workspace'
-- These are isolated from new users

-- Optional: Assign to specific user
-- First, get user's workspace_id from MongoDB
-- Then update:
UPDATE projects 
SET workspace_id = 'USER_WORKSPACE_ID' 
WHERE id = 'PROJECT_ID';
```

## Troubleshooting

### Issue: Migration fails with "column already exists"
**Solution**: Column already added, skip migration or drop and recreate:
```sql
ALTER TABLE projects DROP COLUMN workspace_id;
ALTER TABLE documentations DROP COLUMN workspace_id;
-- Then run migration again
```

### Issue: 401 Unauthorized on all requests
**Solution**: Check JWT token is being sent correctly:
```bash
# Verify token in request
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -v
```

### Issue: Users can see each other's data
**Solution**: Verify workspace_id is in JWT:
```bash
# Decode JWT token (use jwt.io or python)
python -c "
from jose import jwt
token = 'YOUR_TOKEN'
payload = jwt.decode(token, options={'verify_signature': False})
print(payload)
"
# Should show workspace_id in payload
```

### Issue: New users get 500 error on registration
**Solution**: Check MongoDB connection and user collection:
```python
# Test MongoDB connection
python -c "
from app.db.mongo import mongodb
import asyncio
asyncio.run(mongodb.connect_db())
print('MongoDB connected')
"
```

## Rollback (If Needed)

### Step 1: Stop Server
```bash
# Stop the backend server
```

### Step 2: Restore Database
```bash
# For SQLite
cp backend/smartdoc.db.backup backend/smartdoc.db

# For PostgreSQL
psql smartdoc < smartdoc_backup.sql
```

### Step 3: Revert Code
```bash
git checkout HEAD~1  # Or specific commit before multi-tenant
```

## Verification Checklist

After migration, verify:

- [ ] Backend server starts without errors
- [ ] New users can register
- [ ] Users can login and get JWT token
- [ ] JWT token contains workspace_id
- [ ] Users can upload projects
- [ ] Users can only see their own projects
- [ ] User A cannot access User B's projects (404)
- [ ] User A cannot access User B's documentation (404)
- [ ] All existing functionality works

## Success Criteria

✅ Migration script runs without errors
✅ workspace_id column exists in projects table
✅ workspace_id column exists in documentations table
✅ New users get unique workspace_id
✅ JWT token contains workspace_id
✅ Users can only access their own data
✅ Cross-user access returns 404

## Support

If you encounter issues:
1. Check logs: `tail -f backend/logs/app.log`
2. Verify database schema: `sqlite3 smartdoc.db ".schema"`
3. Test JWT token: Use jwt.io to decode
4. Check MongoDB: Verify users collection has workspace_id

## Next Steps After Migration

1. Update frontend to handle 401/403 errors
2. Test all user workflows
3. Monitor logs for any issues
4. Consider adding workspace analytics
5. Implement chat history with workspace_id
6. Add workspace management features (optional)

## Production Deployment

Before deploying to production:

1. ✅ Test migration on staging environment
2. ✅ Backup production database
3. ✅ Schedule maintenance window
4. ✅ Run migration during low-traffic period
5. ✅ Monitor error rates after deployment
6. ✅ Have rollback plan ready
7. ✅ Test critical user flows
8. ✅ Verify data isolation in production
