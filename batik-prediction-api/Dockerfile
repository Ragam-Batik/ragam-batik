FROM public.ecr.aws/lambda/nodejs:18

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .


CMD ["lambda.lambdaHandler"]
