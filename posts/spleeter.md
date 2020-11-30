---
title: 'Spleeter - Cut/separate out levels into tracks from a song'
author: 'Brad Barrows'
date: '2020-11-22'
---
## Where

The [Spleeter github repo](https://github.com/deezer/spleeter) is the place to go for installation instructions. For the most part you should be able to run the install instructions without anaconda if you have python3 installed. You might need to install pip3 as well.

You can get pip by either:   
```
curl -O https://bootstrap.pypa.io/get-pip.py

```

Or the way nicer:
```
sudo python3 -m pip install -U pip
```

Note: you can install pip for Python 2 as well if needed:

```
sudo python2 -m pip install -U pip  
```

Remember to add the bin dir to your path if it is missing. 

I needed to add path for Python 2 but since Python 3 was installed with homebrew path was already setup to include /usr/local/bin.

If needed - add Python 2 pip to path:
```
export PATH=/Users/bbarrows/Library/Python/2.7/bin/pip:$PATH
```



## Install Spleeter

Clone it, create a virtual environment (meaning any packages you installed will only be installed in this "virtal environment". This allows you to install specific package versions without breaking anything globally/elsewhere that uses Python), and install dependencies.

This is partially from the site:

```
git clone https://github.com/Deezer/spleeter && cd spleeter
python -m venv spleeterenv && source spleeterenv/bin/activate
pip install
```

One thing I did different is just skipped the virtual env. Otherwise everytime you want to use spleeter you need to run
```
source ~/repos/spleeter/spleeterenv/bin/activate
```

~/repos/spleeter/ being the directory that I cloned the repo to.

You can skip the virtual environment and globally install with:

Just a 
```
pip install
# This will do the same thing as:
python3 setup.py install
# But it also installs dependencies
# Then you will prob be missing a few
```

If you are missing dependencies you may need:

```
pip3 install musdb
pip3 install museval
pip3 install numpy==1.18.5
pip3 install scipy==1.4.1'
```

I have permissions set up so I don't need sudo to install packages globally. You may need to sudo here if you are not using a virtual environment. Another plus to "virtual envs" I should have mentioned.

## Example Usage

```
function removeFileExtensionFromStdin() {
  # Remove the first period and 0 and infinite characters (letters and numbers) comming after the period
  # Meant to be used like:
  # echo "somefilename.mp3" | removeFileExtensionFromStdin
  sed 's/\.[a-zA-Z0-9]\{0,\}//g'
}
alias extractFileExtensionOff=removeFileExtensionFromStdin


function extractSong() {
  DEFAULTFORMAT="mp3"
  format="${2:-$DEFAULTFORMAT}"
  woExtension=$(basename "$1" | removeFileExtensionFromStdin)
  echo "spleeter separate -p spleeter:5stems -i $1 -c $format  -o $woExtension"
  spleeter separate -p spleeter:5stems -i $1 -c $format  -o $woExtension
}

```

Now go pick a favorite song and find an mp3 for it. I heard that youtube to mp3 converters work wonders when you need some scratch mp3 to work with.

After downloading your mp3 you can run:

```
extractSong ~/Download/someSong.mp3
```

And then in your current directory you will have a folder named someSong with the track broken down to 5 levels.

Change the "5stems" in the command to different numbers to change the number of tracks produced during separation.

I was really impressed with the quality here. Especially after spending some time looking to see how hard it is to manually go and separate out different instruments from a track. It is NOT easy (wasn't do able for me knowing nothing about music mixing software).

