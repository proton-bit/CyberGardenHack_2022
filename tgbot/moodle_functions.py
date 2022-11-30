import requests
import json

URL = "http://j20769994.myjino.ru"
KEY = "c0e10ab91f36dd12b4cf96a6fa6f2566"
ENDPOINT = "/webservice/rest/server.php"
BASE_CODE = "БКТ-221"

def get_cohort_members(cohortid=0):
    fname = 'core_cohort_get_cohort_members'
    params = {"wstoken": KEY, 'moodlewsrestformat': 'json', "wsfunction": fname, 'cohortids[0]':cohortid}
    response = requests.post(URL + ENDPOINT, data = params)
    if response.status_code == 200:
        response = response.json()
        return response
    else:
        return {'ERROR':'damn:(', 'status':response.status_code}


def get_user_by_id(userid=0):
    fname = "core_user_get_users"
    params = {"wstoken": KEY, 'moodlewsrestformat': 'json', "wsfunction": fname, 'criteria[0][key]':'id', 'criteria[0][value]':userid}
    # print('my params ->', params)
    # print()
    response = requests.post(URL + ENDPOINT, data = params)
    if response.status_code == 200:
        response = response.json()
        return response
    else:
        return {'ERROR':'damn:(', 'status':response.status_code}

def get_list_of_students(groupid=0):
    members = get_cohort_members(groupid)
    userids = []
    if type(members) == list:
        userids = members[0]['userids']
    else:
        print('Что-то пошло не так :( ->', members)
        return []
    answer = []
    for userid in userids:
        user_inf = get_user_by_id(userid)
        if 'users' in user_inf.keys():
            user_inf = user_inf['users'][0]
            name = user_inf['lastname'] + ' ' + user_inf['firstname']
            answer.append(name)
        else:
            print('Что-то сломалось :( ->', userid, user_inf)
    return sorted(answer)