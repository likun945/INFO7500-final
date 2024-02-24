variable "gcp_project_id" {
  type    = string
  default = "csye-413919"
}

variable "source_image_family" {
  type    = string
  default = "centos-8"
}

variable "machine_type" {
  type    = string
  default = "n1-standard-1"
}

variable "region" {
  type    = string
  default = "us-east1"
}

variable "ssh_username" {
  type    = string
  default = "packer"
}

source "googlecompute" "example" {
  project_id              = var.gcp_project_id
  source_image_family     = "centos-stream-8"
  source_image_project_id = ["centos-cloud"]
  zone                    = "${var.region}-d"
  disk_size               = 20
  machine_type            = var.machine_type
  image_name              = "webapp-image-${formatdate("YYYY-MM-DD-hh-mm-ss", timestamp())}"
  image_family            = "webapp-family"
  ssh_username            = var.ssh_username
}

build {
  sources = [
    "source.googlecompute.example"
  ]

  provisioner "shell" {
    inline = [
      "sudo groupadd -f csye6225",
      "sudo useradd -m -g csye6225 -s /usr/sbin/nologin csye6225"
    ]
  }

  provisioner "shell" {
    inline = [
      "sudo mkdir -p /var/webapp",
      "sudo chown $(whoami):$(whoami) /var/webapp"
    ]
  }

  provisioner "file" {
    source      = "./"
    destination = "/var/webapp/"
  }

  provisioner "shell" {
    inline = [
      "sudo chown -R csye6225:csye6225 /var/webapp"
    ]
  }

  provisioner "shell" {
    inline = [
      "echo 'Listing all files in /var/webapp and subdirectories:'",
      "ls -R /var/webapp"
    ]
  }

  provisioner "shell" {
    inline = [
      "sudo yum install -y wget",
      "wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm",
      "sudo rpm -ivh mysql80-community-release-el8-1.noarch.rpm",
      "sudo yum install -y mysql-server",
      "sudo systemctl start mysqld",
      "sudo systemctl enable mysqld",
      "curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -",
      "sudo yum install -y nodejs",
      "sudo npm install -g nodemon mocha",
      "cd /var/webapp",
      "sudo -u csye6225 npm install"
    ]
  }

  provisioner "shell" {
    inline = [
      "mysql -u root -p'' -e \"ALTER USER 'root'@'localhost' IDENTIFIED BY 'wW875100\\!';\"",
      "echo 'Granting all privileges to root user on localhost'",
      "mysql -u root -pwW875100! -e 'GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;'",
      "echo 'Testing MySQL password and creating webapp database'",
      "mysql -u root -pwW875100! -e 'SELECT 1;' && echo 'MySQL password test successful'",
      "mysql -u root -pwW875100! -e 'CREATE DATABASE IF NOT EXISTS webapp;' && echo 'webapp database created successfully'"
    ]
  }

  provisioner "shell" {
    inline = [
      "sudo setenforce 0",
      "sudo mv /var/webapp/webapp.service /etc/systemd/system/webapp.service && echo 'Move successful' || echo 'Move failed'",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp.service && echo 'webapp.service is now enabled' || echo 'webapp.service could not be enabled'",
      "sudo systemctl start webapp.service && echo 'webapp.service has been started' || echo 'Failed to start webapp.service'",
      "sleep 10",                                        // 等待10秒以确保服务已经启动
      "sudo systemctl status webapp.service --no-pager", // 查看服务状态
      "journalctl -u webapp.service -n 50 --no-pager",   // 查看最后50行的服务日志
      "curl http://localhost:3000/v1/healthz -i"         // 尝试访问健康检查端点
    ]
  }

}
