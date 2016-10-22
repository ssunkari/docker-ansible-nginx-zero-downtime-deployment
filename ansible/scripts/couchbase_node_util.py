#!/usr/bin/env python

''' Get info about VMs '''

import boto3
from botocore.exceptions import ClientError
import time
import sys
import argparse

# Used for the usage info later
MODE_HELP = """
 MODE:
   n: print Number of running couchbase nodes.
   o: print private DNS name of Oldest running node.
   2: print private DNS name of 2nd oldest node.
   l: List private DNS names of all running nodes.
"""


def get_filters(role, project, environment):
    ''' Return the filters dictionary based on the
        provided value for role '''

    ansible_str = 'Automatically Managed Nodes'
    filters = [{'Name': 'tag:Role', 'Values': [role]},
               {'Name': 'tag:Application', 'Values': [project]},
               {'Name': 'tag:Staging', 'Values': [environment]},
               {'Name': 'tag:Ansible', 'Values': [ansible_str]},
               {'Name': 'instance-state-name', 'Values': ['running']}]
    return filters


def get_vms(filters, key=None, secret=None):
    ''' Get a list of running Couchbase VMs
        sorted by launch time '''
    session = boto3.session.Session(
        aws_access_key_id=key,
        aws_secret_access_key=secret,
        region_name="eu-west-1")
    ec2 = session.resource('ec2')
    instances = ec2.instances.filter(Filters=filters)

    if len(list(instances.all())) == 0:
        return None
    return sort_vms(instances)


def sort_vms(instances):
    ''' Sort the instances by launch time '''
    vms_by_date = {}
    for vma in instances:
        timestamp = int(time.mktime(vma.launch_time.timetuple()))
        vms_by_date["%d-%s" % (timestamp, vma.instance_id)] = vma

    dates = sorted(vms_by_date.keys())
    vms = []

    for date in dates:
        vms.append(vms_by_date[date])

    return vms


def generate_parser():
    ''' Setup an arg parser '''
    parser = argparse.ArgumentParser()
    parser.formatter_class = argparse.RawDescriptionHelpFormatter
    parser.description = \
        'Generates information about running Extranet Couchbase nodes.'
    parser.epilog = MODE_HELP
    parser.add_argument('-k', help='AWS access key',
                        metavar=('key', 'secret'),
                        nargs=2)
    parser.add_argument('mode', help='function to perform, see below',
                        metavar='MODE', choices=['n', 'o', '2', 'l'])
    parser.add_argument('-f', help='filter string, e.g. "Extranet Couchbase"',
                        metavar='role',
                        required=True)
    parser.add_argument('-p', help='Project Name, e.g. Extranet',
                        metavar='proj',
                        required=True)
    parser.add_argument('-e', help='Environment Name, e.g. CI',
                        metavar='env',
                        required=True)
    return parser


def process_args():
    ''' Process the arguments and set the mode '''
    parser = generate_parser()
    args = parser.parse_args()
    args.action = get_action(args.mode)
    return args


def get_action(mode):
    ''' Return a pointer to the function for the quoted mode '''
    modes = {'n': get_number,
             'o': get_oldest,
             '2': get_second,
             'l': get_list}
    return modes[mode]


def get_number(vms):
    ''' Print the number of VMs '''
    if vms is None:
        print '0'
    else:
        print len(vms)


def get_oldest(vms):
    ''' Print the oldest vm '''
    print_vm(vms, 0)


def get_second(vms):
    ''' Print the second oldest vm '''
    print_vm(vms, 1)


def get_list(vms):
    ''' Print out all the vms '''
    if vms is not None:
        for avm in vms:
            print avm.private_ip_address


def print_vm(vms, index):
    ''' print the priv ip address of a particular vm '''
    if vms is not None and index < len(vms):
        print vms[index].private_ip_address
    else:
        print None


def main():
    ''' Usage as a command '''
    args = process_args()
    filters = get_filters(args.f, args.p, args.e)
    try:
        if args.k is None:
            vms = get_vms(filters)
        else:
            vms = get_vms(filters, args.k[0], args.k[1])
        args.action(vms)
    except ClientError as exc:
        print exc
        sys.exit(42)


if __name__ == "__main__":
    main()
