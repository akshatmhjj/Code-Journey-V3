---
title: Networking
domain: cloud-devops
level: intermediate
hours: 30–50
brief: How computers find and talk to each other — IP addressing, DNS, TCP, HTTP, load balancers and firewalls — and how to debug it when they can't.
prereqs:
  - how-the-internet-works
learn:
  - topic: The layers
    detail: A practical view of the OSI/TCP-IP model — what lives where.
  - topic: IP addressing and subnets
    detail: IPv4, CIDR notation (10.0.0.0/16) and private vs public addresses.
  - topic: DNS in depth
    detail: Record types (A, CNAME, MX, TXT), TTLs and propagation.
  - topic: TCP and UDP
    detail: Connections, ports, handshakes and when each is used.
  - topic: HTTP and TLS
    detail: Certificates, termination and HTTP/2 and HTTP/3 basics.
  - topic: Load balancers and proxies
    detail: Layer 4 vs layer 7, reverse proxies like Nginx.
  - topic: Firewalls and security groups
    detail: Allowing only the traffic you mean to.
  - topic: Troubleshooting
    detail: ping, traceroute, dig, curl -v, ss and tcpdump.
resources:
  - title: "AWS: What is a VPC?"
    url: https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html
    provider: AWS
    type: docs
    cost: free
    official: true
  - title: Cloudflare Learning Center
    url: https://www.cloudflare.com/learning/
    provider: Cloudflare
    type: article
    cost: free
  - title: High Performance Browser Networking (free book)
    url: https://hpbn.co/
    provider: Ilya Grigorik
    type: book
    cost: free
  - title: Beej's Guide to Network Programming
    url: https://beej.us/guide/bgnet/
    provider: Brian Hall
    type: book
    cost: free
checked: 2026-10-06
---

## In plain English

When "the site is down", it's often the network: a DNS record pointing to the wrong place, a firewall blocking a port, an expired certificate. Networking knowledge lets you follow a request hop by hop and find where it stops.
