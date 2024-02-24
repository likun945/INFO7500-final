FROM node:16

# 设置容器内的工作目录
WORKDIR /app

# 从宿主机的当前目录下的code文件夹中复制app.js到容器内的/app目录
COPY ./app.js /app

# 当容器启动时执行node app.js
CMD ["node", "app.js"]
