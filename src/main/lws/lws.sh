#!/bin/bash

openssl req \
    -new \
    -newkey rsa:4096 \
    -days 365 \
    -nodes \
    -x509 \
    -subj "/C=NV/ST=SK/L=Nevis/O=selfkey/CN=localhost" \
    -extensions EXT \
    -config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth") \
    -keyout keytmp.pem \
    -out keys/lws_cert.pem

openssl rsa \
	-in keytmp.pem \
	-out keys/lws_key.pem

sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain keys/lws_cert.pem
