"""
Migration script to add workspace_id to existing tables
Run this script once to update the database schema
"""

from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_database():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Add workspace_id to projects table
        try:
            conn.execute(text("""
                ALTER TABLE projects 
                ADD COLUMN workspace_id VARCHAR NOT NULL DEFAULT 'legacy_workspace'
            """))
            conn.execute(text("""
                CREATE INDEX idx_projects_workspace_id ON projects(workspace_id)
            """))
            print("✓ Added workspace_id to projects table")
        except Exception as e:
            print(f"Projects table: {e}")
        
        # Add workspace_id to documentations table
        try:
            conn.execute(text("""
                ALTER TABLE documentations 
                ADD COLUMN workspace_id VARCHAR NOT NULL DEFAULT 'legacy_workspace'
            """))
            conn.execute(text("""
                CREATE INDEX idx_documentations_workspace_id ON documentations(workspace_id)
            """))
            print("✓ Added workspace_id to documentations table")
        except Exception as e:
            print(f"Documentations table: {e}")
        
        conn.commit()
        print("\n✓ Migration completed successfully")

if __name__ == "__main__":
    migrate_database()
