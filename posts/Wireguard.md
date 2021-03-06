---
title: 'Wireguard'
author: 'Brad Barrows'
date: '2019-12-14'
# hero_image: /static/niceday.png
---

How to setup a Wireguard VPN for free!

1. Go grab a free account if you haven't already signed for one from [Azure](https://azure.microsoft.com/en-us/free/search/?&ef_id=EAIaIQobChMIs6y5wYe25gIVFtRkCh3jJANyEAAYASABEgK6pvD_BwE:G:s&OCID=AID2000128_SEM_hDTj6HPx&MarinID=hDTj6HPx_287547081826_azure%20free%20account_e_c_TAwBQrMX_44568976297_kwd-300666823650&lnkd=Google_Azure_Brand&gclid=EAIaIQobChMIs6y5wYe25gIVFtRkCh3jJANyEAAYASABEgK6pvD_BwE) or you could use your AWS free compute hours with a small EC2 instance.

2. Create a the small VM that fits in the free price range

3. Set the networking rules to allow ANY traffic TCP/UDP over port 51820 (Wireguard really only used UDP though I am pretty sure).
   In azure you would do this by creating the [Free VM](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft.freeaccountvirtualmachine?tab=Overview) (which can be created with a few clicks from that link after creating your account). Then once the VM is created and ready you and you have a status of "Your deployment is complete" you can open the "Deployment details" section and click on the Resource link of Type "Microsoft.Compute/virtumachines".

   In the left sidebar there will be a link for Networking. Click this.

   On the networking page click "Add Inbound port rule".

   Create a rule with the following:

   ```
      Source: Any
      Source port range: *
      Destination: Any
      Desitnation port range: 51820
      Protocal: Any
      Action: Allow
      PriorityL 380
      Name: Port_51820
      Description: Wireguard
   ```

4. SSH into your VM.

5. Run the following:
```
# Generate public and private keys

umask 077
wg genkey | tee privatekey | wg pubkey > publickey

# Run these as root

sudo su

cat << EOF >> /etc/sysctl.conf
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
EOF

add-apt-repository ppa:wireguard/wireguard
apt-get update
apt-get install wireguard

echo "This is the Server Private Key:"
cat privatekey

echo "This is the Server Public Key:"
cat publickey

echo "This will be the Client Private Key if you need to generate one (using the OSX Wireguardd App?):"
wg genkey | sudo tee clientprivatekey
cat clientprivatekey
```

1. Now if you are using the OSX Wireguard App you will create a new "empty tunnnel" by clicking the bottom left plus button. Paste in the following replacing <IPAddressOfYourServer> with your VM IP and then replace <ClientPrivateKey> with the value from the clientprivatekey file. <ServerPublicKey> will be replaced with the Server Public Key:

```
[Interface]
PrivateKey = <ClientPrivateKey>
ListenPort = 21841
Address = 192.168.2.2/32
DNS = 1.1.1.1

[Peer]
PublicKey = <ServerPublicKey>
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = <IPAddressOfYourServer>:51820
PersistentKeepalive = 25
```

7. After replacing the values I mentioned and copying this into the Wireguard OSX App you will have a Client Public Key generated. It will be right above the text box you paste the configuration into. Take this value and replace <PublicKeyFromClient> with it. Replace <PrivateKeyfromthe2ndComnmandAbove> with the Server Private Key that was printed out in the last set of commands you ran on the VM. The run the following on your VM:

```
cat << EOF >> /etc/wireguard/wg0.conf
[Interface]
Address = 192.168.2.1
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
ListenPort = 51820
PrivateKey = <PrivateKeyfromthe2ndComnmandAbove>
DNS = 1.1.1.1


[Peer]
PublicKey = <PublicKeyFromClient>
AllowedIPs = 192.168.2.2/32
EOF

```


You may also want to setup a firewall on your VM by running:

```
sudo ufw allow 22/tcp
sudo ufw allow 51820/udp
sudo ufw enable
```

This is optional.

8. It is time to start the Wiregaurd server.
Run this on your VM:
```
sudo wg-quick up wg0
sudo systemctl enable wg-quick@wg0 # Set wireguard to run on system start
sudo wg show # Check the status
```

Note: after every change to your /etc/wiregaurd/wg0.conf file you will need to bring the wiregaurd service down and back up again:

```
sudo wg-quick down wg0
sudo wg-quick up wg0
```

9. You should now be able to go back to you Wireguard client and activate the connection. Google "What Is My IP" and verify that your IP has changed. You could then also try checking if you have DNS Leaks. Note that I am using Cloudflare DNS. I believe for a really secure VPN you would want to install DNS on your VPN as well but I have not bothered to attempt that yet.



Other resources:

[Another Ubuntu based tutorial](https://securityespresso.org/tutorials/2019/03/22/vpn-server-using-wireguard-on-ubuntu/)

[Linode's tutorial which I had trouble with](https://www.linode.com/docs/networking/vpn/set-up-wireguard-vpn-on-ubuntu/)