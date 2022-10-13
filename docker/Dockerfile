ARG IMAGE_REGISTRY=""
ARG DOCKER_IMAGE="node:12-slim"
# Stage deps-cache
FROM ${IMAGE_REGISTRY}${DOCKER_IMAGE} AS deps-cache
ARG CACHE_DIR=/tmp/.build-cache
WORKDIR $CACHE_DIR

# Copy need files, to check deps
COPY package.json .
COPY package-lock.json .

# set app version to 0.0.0 in order not to upload dependencies if only version change
RUN sed -i '1,/version/{x;/first/s///;x;s/version\": \".*\"/version\": \"0.0.0\"/;}' package.json
RUN sed -i '1,/version/{x;/first/s///;x;s/version\": \".*\"/version\": \"0.0.0\"/;}' package-lock.json

# Stage builder-base
FROM ${IMAGE_REGISTRY}${DOCKER_IMAGE} AS builder-base
ARG CACHE_DIR=/tmp/.build-cache
WORKDIR $CACHE_DIR

# get cached unversioned packages
COPY --from=deps-cache $CACHE_DIR/package.json .
COPY --from=deps-cache $CACHE_DIR/package-lock.json .
# get postinstall script and requirements
COPY scripts/postinstall.sh ./scripts/postinstall.sh
COPY lib ./lib
COPY src/_core/styles/resources/img/CesiumDrawHelper/*.png ./src/_core/styles/resources/img/CesiumDrawHelper/

RUN \
    # install system libraries
    apt update && \
    apt -y install git bzip2 curl && \
    # caching npm depedencies
    npm ci --unsafe-perm && \
    # remove files not needed for building
    rm -Rf lib scripts src && \
    rm package.json package-lock.json

WORKDIR /build

# Stage runtime
FROM ${IMAGE_REGISTRY}nginx:alpine AS runtime

# Build arg
ARG ENTRYPOINT=docker/app.sh
ARG NGINX_CONF=docker/nginx.conf
ARG ENVIRONMENTS=docker/environments
ARG HTML=dist
ARG USERNAME="isi_docker"
ARG USERID="1001"
ARG GROUPNAME="isi_docker"
ARG GROUPID="1001"

# Create execution user/group
RUN \
    echo "Creation group ${GROUPNAME}:${GROUPID}" && \
    addgroup -g ${GROUPID} ${GROUPNAME} && \
    echo "Creatin user ${USERNAME}:${USERID}" && \
    adduser -u ${USERID} -G ${GROUPNAME} -h /home/username -D ${USERNAME}

# Copy nginx conf
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf
RUN \
    # nginx configuration
    touch /var/run/nginx.pid && \
    chown -R ${USERNAME}:${GROUPNAME} /var/run/nginx.pid && \
    chown -R ${USERNAME}:${GROUPNAME} /var/cache/nginx && \
    # create app dir
    mkdir /app && \
    chown -R ${USERNAME}:${GROUPNAME} /app

USER ${USERNAME}:${GROUPNAME}

# Copy deliverables
COPY --chown=${USERNAME}:${GROUPNAME} ${HTML} /app/www
COPY --chown=${USERNAME}:${GROUPNAME} ${ENVIRONMENTS} /app/environments
COPY --chown=${USERNAME}:${GROUPNAME} ${ENTRYPOINT} /app/app.sh

RUN \
    # rights
    chmod +x /app/app.sh && \
    # cleanup
    echo "===== SOME GENERAL SYSTEM CLEANUP =====" && \
    rm -rf  /var/cache/apk/*

# Port 80 is reserved for root user
EXPOSE 8080
ENTRYPOINT ["/app/app.sh"]
CMD ["nginx", "-g", "daemon off;"]
