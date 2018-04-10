
print ("reading data...")
i = open("gawker-clean.txt", "r")
sessions = i.readlines()
i.close()

print ("data file read.\n")

userHash = {}
articleHash = {}

userIdx = 0
articleIdx = 0

output = []

def reach(article):
	return article["reach"]

def url(article):
	return article["article"] 

def visit3(user):
	return user["articles_read"]>=3

def name(user):
	return user["user"]

def timeSpent(user):
	return user["time_spent"]


print "processing..."
for l in sessions:
  line = l[:-1].split(" ")
  user = line[0]
  article = line[1]
  ts = int(line[2])
  time_spent = int(line[3])

  if user in userHash:
    uh = userHash[user]["id"]
  else:
    uh = userIdx
    userHash[user] = {"user": user, "id": uh, "views": 0, "articles": {}, "time_spent": 0}
    userIdx = userIdx + 1

  userHash[user]["views"] = userHash[user]["views"] + 1
  userHash[user]["time_spent"] = userHash[user]["time_spent"] + time_spent
  if article not in userHash[user]["articles"]:
  	userHash[user]["articles"][article] = {"time_spent": 0, "ts": ts}
  userHash[user]["articles"][article]["time_spent"] = userHash[user]["articles"][article]["time_spent"] + time_spent
  if (ts < userHash[user]["articles"][article]["ts"]):
  	userHash[user]["articles"][article]["ts"] = ts

  if article in articleHash:
    ah = articleHash[article]["id"]
  else:
    ah = articleIdx
    articleHash[article] = {"article": article, "id": ah, "views": 0, "visitors": {}, "time_spent": 0}
    articleIdx = articleIdx + 1

  articleHash[article]["views"] = articleHash[article]["views"] + 1
  articleHash[article]["time_spent"] = articleHash[article]["time_spent"] + time_spent
  if user not in articleHash[article]["visitors"]:
  	articleHash[article]["visitors"][user] = {"time_spent": 0, "ts": ts}
  articleHash[article]["visitors"][user]["time_spent"] = articleHash[article]["visitors"][user]["time_spent"] + time_spent
  if (ts < articleHash[article]["visitors"][user]["ts"]):
  	articleHash[article]["visitors"][user]["ts"] = ts
  output.append([str(uh), str(ah), line[2], line[3]])


print "processing done.\n"
###

articles = []
users = []

for user in userHash.keys():
	userHash[user]["articles_read"] = len(userHash[user]["articles"])
	users.append(userHash[user])

for article in articleHash.keys():
	articleHash[article]["reach"] = len(articleHash[article]["visitors"])
	articles.append(articleHash[article])


### the 5 most visited articles

most_visited_articles_5 = map(url, sorted(articles, key=reach)[-6:])
print "most visited articles:"
for a in most_visited_articles_5:
  print a

### the people who visited at least 3 articles

visitors3 = filter(visit3, users)
print "People who visited 3 articles"
print len(visitors3)

### among which those who spent the most time on average

most_time_visitors3 = map(name, sorted(visitors3, key=timeSpent)[-5:])
print "Among people who visited 3 articles, the 5 who spent the most time:"
for v in most_time_visitors3:
  print v


### sadpizza

sadpizzaUsers = articleHash['/5986463/this-is-the-saddest-sentence-about-pizza-ever']["visitors"].keys() ### people who visited that article
sadpizzaArticles = {}

for u in sadpizzaUsers:
  art = userHash[u]["articles"].keys()
  for a in art:
    if a not in ('/5986463/this-is-the-saddest-sentence-about-pizza-ever', "/"):
      if a in sadpizzaArticles:
        sadpizzaArticles[a] = sadpizzaArticles[a] + 1
      else:
        sadpizzaArticles[a] = 1

max = 0
k = sadpizzaArticles.keys()
maxA = ""
for a in k:
  if sadpizzaArticles[a]>max:
    maxA = a
    max = sadpizzaArticles[a]

print "The article seen the most by people who have seen /5986463/this-is-the-saddest-sentence-about-pizza-ever is:"
print maxA + " (" + str(max) + " times)"

