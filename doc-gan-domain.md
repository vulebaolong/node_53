- cài nginx trên ubuntu
sudo apt update
sudo apt install nginx

- mở tệp cấu hình
sudo nano /etc/nginx/sites-available/default

- chạy lệnh để kiểm tra nginx
sudo nginx -t

- restart lại nginx
sudo systemctl restart nginx