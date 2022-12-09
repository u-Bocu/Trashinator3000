-- Drop tables
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS scan;

-- Create tables
CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scan (
    scan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    confidence INTEGER NOT NULL,
    prediction TEXT NOT NULL,
    FOREIGN KEY (user_id) -- Add foreign key
        REFERENCES user (user_id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
);

-- Add some dummy users
INSERT INTO user (username, password)
VALUES ("dfh", "azerty"),
        ("jujututu", "tutupigeon"),
        ("matt_le_boss", "uydfgre"),
        ("issa_de_qista", "kjhgf");

-- Add some dummy scan
INSERT INTO scan (user_id, filename, confidence, prediction)
VALUES (1, "toto.png", 80, "organic"),
        (NULL, "tutu.png", 92, "paper"),
        (2, "pigeon.png", 72, "plastic"),
        (3, "example.png", 84, "paper"),
        (4, "azert.png", 75, "organic"),
        (4, "jhgf.png", 78, "plastic");