## 说明

优化部分由AI完成，不涉及任何他人版权等信息，代码公开透明，请勿拿来做违法违规的事，也请某些自以为是的小人不要将无意义的代码非要给自己加帽子

## 更新

10月7日nginx优化gzip设置、更改缓存策略

调整前端显示自适应

## Vercel部署

请将所有上传到Github，然后在Vercel部署部署启用即可

## 云服务部署部分

云服务器：修改所有指向域名为自己的解析域名并修改配置文件：

```
server {
    listen 80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    listen [::]:80;
    server_name jsd.cdn.noisework.cn www.jsd.cdn.cn; # 更改为你自己的解析域名

    root /www/wwwroot/jsd.cdn.cn; # 宝塔默认目录，换成你自己的域名或你主页文件的所在目录

    # SSL 配置
    ssl_certificate /www/server/panel/vhost/cert/jsd.cdn.cn/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/jsd.cdn.cn/privkey.pem;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    error_page 497 https://$host$request_uri;

    location = / {
        index index.html; 
    }

    location / {
        try_files $uri $uri/ @proxy;
    }

    location @proxy {
        proxy_pass https://cdn.jsdelivr.net;
        proxy_set_header Host cdn.jsdelivr.net;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;

        # 缓存设置
        proxy_cache cache_one;
        proxy_cache_key $host$uri$is_args$args;
        proxy_cache_valid 200 301 302 1440m; # 适当延长缓存时间
        proxy_cache_valid 404 1m; # 404 响应缓存 1 分钟

        # 图像文件的缓存策略
        location ~* \.(gif|png|jpg|jpeg|webp)$ {
            proxy_cache_valid 200 1d; # 缓存成功响应 1 天
            proxy_cache_valid 404 1m; # 404 响应缓存 1 分钟
            proxy_set_header Accept-Encoding gzip; # 请求 gzip 压缩
        }

        proxy_ignore_headers Set-Cookie Cache-Control expires;
        proxy_max_temp_file_size 5m; # 限制返回文件大小
        proxy_intercept_errors on;
        error_page 413 /custom_413.html;
    }

    location = /custom_413.html {
        root /www/wwwroot/jsd.cdn.cn; 
        internal;
        default_type text/html;
        return 200 '文件超过5MB，不予返回！';
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types image/jpeg image/png image/gif image/webp;
    gzip_min_length 1000; # 仅压缩大于 1000 字节的响应
}
```

