<!-- build image -->

```bash
docker build -t vulebaolong/img-cyber_community:latest .
```

<!-- delete image -->

```bash
docker rmi vulebaolong/img-cyber_community:latest
docker image remove vulebaolong/img-cyber_community:latest
```

<!-- run container -->

```bash
docker run --name con-cyber_community -p 3070:3069 --env-file .env -d vulebaolong/img-cyber_community:latest
```

<!-- xoá container -->
```bash
docker rm con-cyber_community
docker container remove con-cyber_community
```

<!-- stop container -->
```bash
docker container stop con-cyber_community
```

<!-- 1.68GB -->
<!-- 720MB -->
<!-- 552MB -->
<!-- 436MB -->
