#!/bin/bash
set -e

VERSION=$1
OTP=$2

pushd packages/cloudflare-worker-mock
npm version $VERSION
npm publish --otp=$OTP
popd

pushd packages/types-cloudflare-worker
npm version $VERSION
npm publish --otp=$OTP
popd

pushd packages/@udacity/types-service-worker-mock
npm version $VERSION
npm publish --otp=$OTP
popd
