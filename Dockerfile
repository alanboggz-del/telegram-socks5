FROM debian:bookworm-slim

# Force non-interactive mode for apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Install Dante and Playit
RUN apt-get update && apt-get install -y dante-server curl \
    && curl -SsL https://packages.playit.gg/install.sh | bash

# Configure Dante
RUN echo "logoutput: stderr\n\
internal: 0.0.0.0 port = 1080\n\
external: eth0\n\
clientmethod: none\n\
socksmethod: none\n\
socks pass { from: 0.0.0.0/0 to: 0.0.0.0/0 }" > /etc/danted.conf

# Start both services
CMD danted -D && /usr/bin/playit
