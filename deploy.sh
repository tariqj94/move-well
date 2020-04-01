#!/usr/bin/env bash
rm -rf build
mkdir ../build
cp -r * ../build
zip -r build.zip ../build
rm -rf ../build