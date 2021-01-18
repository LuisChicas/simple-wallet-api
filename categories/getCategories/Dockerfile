FROM public.ecr.aws/lambda/nodejs:12

COPY . /var/task/

RUN npm install && npm run build

CMD [ "dist/app.handler" ]  