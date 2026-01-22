<!-- build image -->

```bash
docker build -t vulebaolong/img-cyber_community:latest .
docker build --platform=linux/amd64 -t vulebaolong/img-cyber_email:latest .
docker build --platform=linux/amd64 -t vulebaolong/img-cyber_order:latest .
```

<!-- delete image -->

```bash
docker rmi vulebaolong/img-cyber_community:latest
docker image remove vulebaolong/img-cyber_community:latest
docker image remove vulebaolong/img-cyber_email:latest
docker image remove vulebaolong/img-cyber_order:latest
```

<!-- list image/container/volume -->

```bash
# list đang chạy
docker image list
docker container list
docker volume list

# list đang stop và đang chạy
docker container list -a
docker image list -a
docker volume list -a

docker ps <-> docker container list
docker ps -a <-> docker container list -a
```

<!-- run container -->

```bash
docker run --name con-cyber_community -p 3070:3069 --env-file .env -d vulebaolong/img-cyber_community:latest
```

<!-- xoá container -->

```bash
docker rm con-cyber_community
docker container remove con-cyber_community
docker container remove con-cyber_email
docker container remove con-cyber_order
```

<!-- stop container -->

```bash
docker container stop con-cyber_community
docker container stop con-cyber_email
docker container stop con-cyber_order
```

<!-- xem terminal của 1 container -->

```bash
docker logs con-cyber_email
```

<!-- 1.68GB -->
<!-- 720MB -->
<!-- 552MB -->
<!-- 436MB -->


```bash
sudo ./svc.sh install
sudo ./svc.sh start
```