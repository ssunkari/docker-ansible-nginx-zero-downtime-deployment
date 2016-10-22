#!/usr/bin/python

''' Simple program to query bucket info via Couchbase API '''

import requests
import sys
import argparse

API_BUCKETS_URL = 'http://localhost:8091/pools/default/buckets/'


def query_bucket(bucket,username,password):
    ''' Send the query to the API '''
    try:
        result = requests.get(API_BUCKETS_URL + bucket, auth=(username,password))

        if result.status_code == 404:
            print "Error: Got 404 - no bucket by this name"
            sys.exit(42)
        result_json = result.json()
    except requests.exceptions.RequestException as exc:
        print "Error: API request failed - %s" % (exc)
        sys.exit(99)
    return result_json


def get_ram_quota(bucket,username,password):
    ''' Return the RAM quota for a given bucket '''
    try:
        result = query_bucket(bucket,username,password)
        ram_quota_bytes = int(result['quota']['rawRAM'])
        ram_quota = ram_quota_bytes / (1024*1024)
    except ValueError as exc:
        print "Error: RAM quota from API Not a Number " + \
              "or out of range - %s" % (exc)
        sys.exit(100)
    except KeyError as exc:
        print "Error: API return was not structured as " + \
              "expected - Key error %s" % (exc)
        sys.exit(101)
    return ram_quota


def get_flush_setting(bucket,username,password):
    ''' Get the flush setting for a bucket '''
    try:
        query = query_bucket(bucket,username,password)['controllers']
        if 'flush' in query.keys():
            result = 1
        else:
            result = 0
    except (KeyError, ValueError) as exc:
        print "Error: API return was not structured as " + \
              "expected - Key error %s" % (exc)
        sys.exit(101)
    return result


def process_args():
    ''' Process command line arguments '''
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=('ram', 'flush'))
    parser.add_argument('bucket_name')
    parser.add_argument('username')
    parser.add_argument('password')
    args = parser.parse_args()
    return args


def main():
    ''' Run the program '''
    args = process_args()
    if args.mode == "ram":
        result = get_ram_quota(args.bucket_name,args.username,args.password)
    if args.mode == "flush":
        result = get_flush_setting(args.bucket_name,args.username,args.password)
    print result

if __name__ == "__main__":
    main()
