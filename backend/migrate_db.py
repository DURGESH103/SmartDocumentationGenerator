import sqlite3
import os

def migrate_database():
    db_path = os.path.join(os.path.dirname(__file__), 'smartdoc.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN workspace_id VARCHAR NOT NULL DEFAULT 'legacy_workspace'")
        cursor.execute("CREATE INDEX idx_projects_workspace_id ON projects(workspace_id)")
        print("Added workspace_id to projects table")
    except sqlite3.OperationalError as e:
        print(f"Projects: {e}")
    
    try:
        cursor.execute("ALTER TABLE documentations ADD COLUMN workspace_id VARCHAR NOT NULL DEFAULT 'legacy_workspace'")
        cursor.execute("CREATE INDEX idx_documentations_workspace_id ON documentations(workspace_id)")
        print("Added workspace_id to documentations table")
    except sqlite3.OperationalError as e:
        print(f"Documentations: {e}")
    
    conn.commit()
    conn.close()
    print("Migration completed")

if __name__ == "__main__":
    migrate_database()
