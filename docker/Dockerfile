FROM node:16

ENV PORT=3000

RUN cd /opt; git clone https://github.com/scaffold-eth/scaffold-eth.git

WORKDIR /opt/scaffold-eth

RUN yarn install

COPY start.sh .

CMD ["/bin/bash", "start.sh"]
