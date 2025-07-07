-- Tạo database
CREATE DATABASE DATASTORES;
GO

USE DATASTORES;
ALTER TABLE Products
ADD IsDeleted BIT DEFAULT 0;

GO

-- Bảng Users: thông tin người dùng, thêm Address và Phone
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Address NVARCHAR(255) NULL,         -- Địa chỉ mặc định của user
    Phone NVARCHAR(20) NULL,             -- Số điện thoại mặc định
    CreatedAt DATETIME DEFAULT GETDATE(),
    Role NVARCHAR(20) NOT NULL DEFAULT 'User'  -- 'User' hoặc 'Admin'
);
GO


-- Bảng Auth: thông tin đăng nhập liên kết với Users
CREATE TABLE Auth (
    UserID INT PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- Bảng OtpCodes: dùng cho xác thực OTP
CREATE TABLE OtpCodes (
    Email NVARCHAR(255) PRIMARY KEY,
    OTP NVARCHAR(6) NOT NULL,
    ExpiresAt DATETIME NOT NULL
);
GO

-- Bảng Products: sản phẩm bán
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL,
    Price DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    Sale DECIMAL(5,2) DEFAULT 0.00,
    Image NVARCHAR(255),
    IsDeleted DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);
ALTER TABLE Products
ADD SaleStart DATETIME NULL,
    SaleEnd DATETIME NULL;

ALTER TABLE Products
ADD SaleFromHour INT NULL,
    SaleToHour INT NULL;

ALTER TABLE Orders
    ADD TotalPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00
GO

-- Bảng Orders: lưu đơn hàng, thêm địa chỉ và số điện thoại giao hàng riêng cho từng đơn
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    ShippingAddress NVARCHAR(255) NULL,   -- Địa chỉ giao hàng riêng cho đơn này
    Phone NVARCHAR(20) NULL,               -- Số điện thoại liên hệ đơn này
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',  -- Trạng thái đơn: Pending, Confirmed, Shipped, Cancelled
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO

CREATE TABLE Cart (
    CartID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    CartDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
);



DROP TABLE Cart

-- Thêm 10 sản phẩm mẫu

DELETE FROM Orders;

ALTER TABLE Products
ADD Sale DECIMAL(5,2) DEFAULT 0.00;

UPDATE Products
SET Sale = 20;

UPDATE Products
SET Sale = 30;


-- Kiểm tra dữ liệu
SELECT * FROM Products;

UPDATE Products
SET Sale = 34 , SaleFromHour = 15, SaleToHour = 24
WHERE ProductID = 86

UPDATE Products
SET Sale = 10, SaleFromHour = 0, SaleToHour = 24
WHERE ProductID BETWEEN 66 AND 69;

UPDATE Products
SET Sale = 15, SaleFromHour = 0, SaleToHour = 24
WHERE ProductID BETWEEN 70 AND 74;



SELECT * FROM Orders;
    SELECT * FROM Users;
SELECT * FROM Auth;
SELECT * FROM OtpCodes;
select * from Cart
select * from Products

UPDATE Products
SET Sale = 10
WHERE ProductID BETWEEN 80 AND 85;

UPDATE Products
SET IsDeleted = 0
WHERE ProductID IN (
  11, 15, 16, 19, 20, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40
);

-- Cập nhật Sale = 20% từ 6h đến 7h sáng hôm nay



INSERT INTO Products (ProductName, Description, Price, Stock, Image, IsDeleted) VALUES
(N'Áo thun nam cổ tròn', N'Áo thun cotton thoáng mát, cổ tròn basic.', 150000, 100, 'uploads/images/tx.png', 0),
(N'Quần jean nữ rách gối', N'Jean nữ cạp cao, co giãn, phong cách.', 350000, 80, 'uploads/images/tx1.png', 0),
(N'Giày sneaker trắng', N'Sneaker trắng, dễ phối đồ, êm chân.', 500000, 50, 'uploads/images/tx2.png', 0),
(N'Túi xách da PU', N'Túi xách nữ nhỏ gọn, da PU cao cấp.', 420000, 60, 'uploads/images/tx3.png', 0),
(N'Áo khoác dù nam', N'Áo khoác gió nam, chống nước.', 270000, 70, 'uploads/images/tx4.png', 0),
(N'Đồng hồ dây da nam', N'Đồng hồ quartz dây da thời trang.', 690000, 40, 'uploads/images/tx5.png', 0),
(N'Váy dài vintage', N'Váy vintage hoa nhí, chất mềm.', 320000, 55, 'uploads/images/tx6.png', 0),
(N'Mũ lưỡi trai unisex', N'Mũ lưỡi trai vải kaki, form chuẩn.', 100000, 120, 'uploads/images/tx7.png', 0),
(N'Áo sơ mi nữ caro', N'Sơ mi nữ họa tiết caro, dáng suông.', 200000, 90, 'uploads/images/tx8.png', 0),
(N'Quần shorts kaki nam', N'Shorts kaki nam, năng động, trẻ trung.', 180000, 75, 'uploads/images/tx9.png', 0),
(N'Giày sandal nữ', N'Sandal quai chéo nữ tính, đế bệt.', 220000, 85, 'uploads/images/tx10.png', 0),
(N'Balo vải canvas', N'Balo canvas form đứng, nhiều ngăn.', 250000, 65, 'uploads/images/tx11.png', 0),
(N'Áo len nam cổ tim', N'Áo len mỏng, cổ tim, giữ ấm tốt.', 300000, 50, 'uploads/images/tx12.png', 0),
(N'Khăn choàng nữ lụa', N'Khăn choàng lụa mềm, hoa văn thanh lịch.', 180000, 100, 'uploads/images/tx13.png', 0),
(N'Ví da cầm tay', N'Ví cầm tay da mềm, nhiều ngăn tiện dụng.', 250000, 45, 'uploads/images/tx14.png', 0),
(N'Áo hoodie nữ', N'Hoodie nữ nỉ mềm, ấm áp, dáng rộng.', 260000, 70, 'uploads/images/tx15.png', 0),
(N'Giày thể thao nam', N'Giày thể thao nam đế cao su, bền chắc.', 480000, 40, 'uploads/images/tx16.png', 0),
(N'Áo khoác jean unisex', N'Khoác jean dáng rộng, nam nữ đều mặc được.', 390000, 30, 'uploads/images/tx17.png', 0),
(N'Váy ngắn họa tiết hoa', N'Váy hoa xòe nhẹ, nữ tính.', 280000, 60, 'uploads/images/tx18.png', 0),
(N'Băng đô vải', N'Băng đô vải co giãn, dễ thương.', 60000, 150, 'uploads/images/tx19.png', 0);

-- Nhóm 1: 2 sản phẩm sale 50%
UPDATE Products SET Sale = 50, SaleFromHour = 9,  SaleToHour = 11 WHERE ProductID = 69;
UPDATE Products SET Sale = 50, SaleFromHour = 18, SaleToHour = 20 WHERE ProductID = 77;

-- Nhóm 2: 3 sản phẩm sale từ 40–45%
UPDATE Products SET Sale = 42, SaleFromHour = 12, SaleToHour = 14 WHERE ProductID = 66;
UPDATE Products SET Sale = 44, SaleFromHour = 0,  SaleToHour = 2  WHERE ProductID = 73;
UPDATE Products SET Sale = 40, SaleFromHour = 9,  SaleToHour = 11 WHERE ProductID = 85;

-- Nhóm 3: 5 sản phẩm sale trên 30%
UPDATE Products SET Sale = 38, SaleFromHour = 0,  SaleToHour = 2  WHERE ProductID = 68;
UPDATE Products SET Sale = 36, SaleFromHour = 9,  SaleToHour = 11 WHERE ProductID = 81;
UPDATE Products SET Sale = 34, SaleFromHour = 12, SaleToHour = 14 WHERE ProductID = 75;
UPDATE Products SET Sale = 14, SaleFromHour = 12, SaleToHour = 14 WHERE ProductID = 86;
UPDATE Products SET Sale = 30, SaleFromHour = 18, SaleToHour = 20 WHERE ProductID = 70;

-- Nhóm 4: 6 sản phẩm Sale = 10%
UPDATE Products SET Sale = 10, SaleFromHour = 18, SaleToHour = 20 WHERE ProductID = 74;
UPDATE Products SET Sale = 10, SaleFromHour = 12, SaleToHour = 14 WHERE ProductID = 67;
UPDATE Products SET Sale = 10, SaleFromHour = 0,  SaleToHour = 2  WHERE ProductID = 79;
UPDATE Products SET Sale = 10, SaleFromHour = 15, SaleToHour = 17 WHERE ProductID = 82;
UPDATE Products SET Sale = 10, SaleFromHour = 12, SaleToHour = 14 WHERE ProductID = 78;
UPDATE Products SET Sale = 10, SaleFromHour = 15, SaleToHour = 17 WHERE ProductID = 71;

-- Nhóm 5: còn lại Sale nhẹ chẵn 12–28%
UPDATE Products SET Sale = 18, SaleFromHour = 20, SaleToHour = 22 WHERE ProductID = 83;
UPDATE Products SET Sale = 26, SaleFromHour = 12, SaleToHour = 14 WHERE ProductID = 72;
UPDATE Products SET Sale = 24, SaleFromHour = 15, SaleToHour = 17 WHERE ProductID = 80;
UPDATE Products SET Sale = 12, SaleFromHour = 15, SaleToHour = 17 WHERE ProductID = 76;
UPDATE Products SET Sale = 20, SaleFromHour = 15, SaleToHour = 17 WHERE ProductID = 98;
