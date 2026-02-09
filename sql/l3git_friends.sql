CREATE TABLE IF NOT EXISTS l3git_friends (
    citizenid VARCHAR(50) NOT NULL,
    friend VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (citizenid, friend),
    INDEX idx_friend (friend)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS l3git_friend_gifts (
    id INT NOT NULL AUTO_INCREMENT,
    sender_citizenid VARCHAR(50) NOT NULL,
    sender_name VARCHAR(120) NOT NULL,
    recipient_citizenid VARCHAR(50) NOT NULL,
    item VARCHAR(100) NOT NULL,
    amount INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    claimed TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    INDEX idx_recipient (recipient_citizenid),
    INDEX idx_sender (sender_citizenid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
