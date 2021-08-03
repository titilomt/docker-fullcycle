FROM golang:alpine AS build

#disable crosscompiling 
ENV CGO_ENABLED=0

#compile linux only
ENV GOOS=linux

WORKDIR /src

COPY . .

#build the binary with debug information removed
RUN go build -ldflags '-w -s' -a -installsuffix cgo -o output

FROM scratch AS bin

COPY --from=build /src/output output

CMD ["./output"]
