## CREATE MD FILE FROM JSON TALENT
1. Edit file **talent-v3-to-md.py** file
2. Change start and end index user. Example we want to extract the users from index 0 to 100
```
idxStart = 0
idxEnd = 100
```
3. Run the pyton code `python talent-v3-to-md.py`
4. Check the result in the *out-md* directory. The total user in single *.md file has prefix *user_xx.md*