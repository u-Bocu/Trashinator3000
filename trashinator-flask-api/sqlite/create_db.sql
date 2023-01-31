-- Drop tables
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS scan;

-- Create tables
CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    mail_address TEXT NOT NULL,
    score INTEGER DEFAULT 0
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
INSERT INTO scan (user_id, filename, timestamp, confidence, prediction)
VALUES (1, "toto.png", date(current_timestamp, '-8 days'), 80, "organic"),
        (NULL, "tutu.png", date(current_timestamp, '-7 days'), 92, "paper"),
        (2, "pigeon.png", date(current_timestamp, '-6 days'), 72, "plastic"),
        (3, "example.png", date(current_timestamp, '-3 days'), 84, "paper"),
        (4, "azert.png", date(current_timestamp, '-4 days'), 75, "organic"),
        (1, "jhgf.png", date(current_timestamp, '-4 days'), 78, "other"),
        (4, "pomme.png", date(current_timestamp, '-5 days'), 78, "organic"),
        (NULL, "scrap_metal.png", date(current_timestamp), 78, "g&m"),
        (NULL, "jhgf.png", date(current_timestamp), 78, "other"),
        (4, "jhgf.png", date(current_timestamp, '-2 days'), 78, "other");