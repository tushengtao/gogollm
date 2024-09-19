#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from nanoid import generate


def generate_flow_id():
    use_characters = '0123456789abcdef'
    output_size = 16
    return generate(use_characters, output_size)


def generate_msg_id():
    return generate()
