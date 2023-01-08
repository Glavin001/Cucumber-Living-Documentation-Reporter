FROM mcr.microsoft.com/devcontainers/typescript-node:0-18

# https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies
RUN apt-get update && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y install --no-install-recommends \
        libgtk2.0-0 \
        libgtk-3-0 \
        libgbm-dev \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 \
        xauth \
        xvfb

RUN curl -L -O https://github.com/cucumber/json-formatter/releases/download/v19.0.0/cucumber-json-formatter-linux-amd64 \
    && mv cucumber-json-formatter-linux-amd64 cucumber-json-formatter \
    && chmod +x cucumber-json-formatter \
    && mkdir -p $HOME/.local/bin/ \
    && mv cucumber-json-formatter $HOME/.local/bin/
