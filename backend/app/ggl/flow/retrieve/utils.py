#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re


def contains_chinese(s):
    return re.search(u'[\u4e00-\u9fff]', s) is not None


def filter_array_by_substring(target_string, to_filter_array):
    """
    过滤数组，只保留那些包含目标字符串子串的元素。

    参数:
    - target_string: 目标字符串
    - to_filter_array: 待过滤的数组

    返回:
    - 新的数组，只包含那些包含目标字符串子串的元素
    """
    new_array = []
    for item in to_filter_array:
        if item.lower() in target_string.lower():
            new_array.append(item)
        if target_string.lower() in item.lower():
            new_array.append(item)
    return new_array
