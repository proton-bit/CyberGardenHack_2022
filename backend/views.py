from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
import requests
import json

a = []

flag = False

flagNewData = True


# Create your views here.
@csrf_exempt
def index(request):
    global flag
    global flagNewData
    if not flag:
        return redirect("http://127.0.0.1:8000/auth")

    print(request.POST)
    query = request.POST.get('journal')
    if query:
        print('query:', query)
        flagNewData = True

    return render(request, "base.html")





def api(request):
    global flagNewData
    global a

    with open('backend/dataBase.json', 'r', encoding='utf-8') as f:
        json_schedule = json.load(f)

    if flagNewData:
        a = []
        flagNewData = False
        global flag
        if not flag:
            return redirect("http://127.0.0.1:8000/auth")
        cnt_subj = len(json_schedule)
        cnt_stud = len(json_schedule[0]['visiting'])
        for i in range(cnt_stud):
            name = list(json_schedule[0]['visiting'].keys())[i]
            vis = [-3 for j in range(cnt_subj)]

            for j in range(cnt_subj):
                if json_schedule[j] is -1:
                    vis[j] = None
                else:
                    vis[j] = json_schedule[j]['visiting'][name]
            tgfront(Schedule(name, vis[0], vis[1], vis[2], vis[3], vis[4], vis[5]))

    return JsonResponse(a, safe=False)
    # return JsonResponse({'value': query})


def about(request):
    global flag
    global flagNewData

    query = request.POST.get('journal')
    if query:
        print('query:', query)
        flagNewData = True

    if not flag:
        return redirect("http://127.0.0.1:8000/auth")
    if request.GET.get('query'):
        # print(1)
        api(request)

    return render(request, "base.html")


logins = ['Maxi', 'Вадим']
passw = {'Maxi': '123', 'Вадим': '321'}


def auth(request):
    global logins
    global passw
    global flag
    global flagNewData

    query = request.POST.get('journal')
    if query:
        print('query:', query)
        flagNewData = True

    login = request.GET.get('login')
    password = request.GET.get('password')
    if login in logins and passw[login] == password:
        flag = True
        return redirect("http://127.0.0.1:8000/")
    return render(request, "base.html")


def account(request):
    global json_schedule
    global flag
    global flagNewData

    query = request.POST.get('journal')
    if query:
        print('query:', query)
        flagNewData = True

    if not flag:
        return redirect("http://127.0.0.1:8000/auth")
    # api(request)

    return render(request, "base.html")


class Schedule:
    def __init__(self, name, mon, tur, wen, th, fr, sn):
        self.name = name
        self.mon = mon
        self.tur = tur
        self.wen = wen
        self.th = th
        self.fr = fr
        self.sn = sn


def tgfront(obj): #поменять под лизу
    print(3)
    global a
    global flagNewData
    if isinstance(obj, Schedule):
        tmp = {"name": obj.name, "mon": obj.mon, "tur": obj.tur, "wen": obj.wen, "th": obj.th, "fr": obj.fr, "sn": obj.sn}
    else:
        tmp = {"name": obj, "mon": None, "tur": None, "wen": None, "th": None, "fr": None,
               "sn": None}

    a.append(tmp)


