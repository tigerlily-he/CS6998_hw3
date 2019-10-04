from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

from data import load_providers

providers = load_providers()
# INFINITY
providers_current_id = len(providers)
current_advisor_profile = None

company_search_term = None
department_search_term = None

departments_autocomplete = [
    "Design",
    "Product",
    "Research",
    "Engineering",
    "Data Science",
    "Machine Learning",
    "Other"
    ]

meeting_requests = []
meeting_id = 0
def gen_company_autocomplete ():
    global providers

    company_list_result = []
    for person in providers:
        if person["company"] not in company_list_result:
            company_list_result.append(person["company"])
    return company_list_result

@app.route('/advisors')
def advisors():
    global company_search_term
    global department_search_term

    if company_search_term is None:
        company_search = {"entry": ""}
    else:
        company_search = {"entry": company_search_term}
    if department_search_term is None:
        department_search = {"entry": ""}
    else:
        department_search = {"entry": department_search_term}
    return render_template("advisor.html", advisors = providers, depts = departments_autocomplete, company_search = company_search , department_search = department_search, companies = gen_company_autocomplete())

@app.route('/')
def landing():
    global company_search_term
    global department_search_term
    company_search_term = None
    department_search_term = None

    return render_template("main_search.html", advisors = providers, depts = departments_autocomplete,company_search = {"entry": ""}, department_search = {"entry": ""}, companies = gen_company_autocomplete())

@app.route('/find', methods=['GET', 'POST'])
def find():
    company_term = request.get_json()["company"].lower()
    department_term = request.get_json()["department"].lower()
    results = []
    results_id = set()

    if (len(company_term.strip())==0 and len(department_term.strip())==0):
        return jsonify(matches=providers)

    if len(company_term.strip())>0 and len(department_term.strip())==0:
        print("Search advisor by company = " + company_term)
        for person in providers:
            if company_term in person["company"].lower():
                results.append(person)
                results_id.add(person["id"])
    elif len(department_term.strip())>0 and len(company_term.strip())==0:
        print("Search advisor by department = " + department_term)
        for person in providers:
            if department_term in person["department"].lower():
                results.append(person)
                results_id.add(person["id"])
    else:
        for person in providers:
            if company_term in person["company"].lower():
                if department_term in person["department"].lower():
                    results.append(person)
                    results_id.add(person["id"])
    global company_search_term
    global department_search_term
    company_search_term = None
    department_search_term = None

    return jsonify(matches=results)

@app.route('/create_profile')
def create_profile():
    if current_advisor_profile is None:
        return render_template("create_profile.html", current_user={})
    else:
        return render_template("create_profile.html", current_user=current_advisor_profile)
    # return render_template("create_profile.html")

@app.route('/save_advisor', methods=['GET', 'POST'])
def save_advisor():
    global providers_current_id
    global providers
    global current_advisor_profile

    advisor_data = request.get_json()["entry"]
    current_advisor_profile = {
     "id": providers_current_id,
     "name": advisor_data["name"],
     "university": advisor_data["university"],
     "department": advisor_data["department"],
     "company": advisor_data["company"],
     "interests": advisor_data["interests"],
     "availability": advisor_data["availability"],
     "bookmarked": False,
    }

    providers.append(current_advisor_profile)
    providers_current_id += 1
    return jsonify(advisors=providers, current=current_advisor_profile)

@app.route('/edit_profile', methods=['GET', 'POST'])
def edit_profile():
    global providers_current_id
    global providers
    global current_advisor_profile
    advisor_data = request.get_json()
    current_advisor_profile = advisor_data

    for person in providers:
        if person["id"] == advisor_data["id"]:
            person["name"] = advisor_data["name"]
            person["university"] = advisor_data["university"]
            person["company"] = advisor_data["company"]
            person["department"] = advisor_data["department"]
            person["interests"] = advisor_data["interests"]
            person["availability"] = advisor_data["availability"]
    return jsonify(current_user=current_advisor_profile)

@app.route('/delete_profile', methods=['GET', 'POST'])
def delete_profile():
    global providers_current_id
    global providers
    global current_advisor_profile

    delete_id = request.get_json()["id"]

    for x in range(len(providers)):
        if providers[x]["id"] == int(delete_id):
            providers.remove(providers[x])

    current_advisor_profile = None
    providers_current_id -= 1
    return jsonify(current_user={})

@app.route('/user_profile')
def user_profile():
    if current_advisor_profile is None:
        return render_template("user_profile.html", current_user={})
    else:
        return render_template("user_profile.html", current_user=current_advisor_profile)

@app.route('/set_search_terms', methods=['GET', 'POST'])
def set_search_terms():
    global company_search_term
    global department_search_term

    company_search_term = request.get_json()["company"]
    department_search_term = request.get_json()["department"]
    return jsonify(data={})

@app.route('/set_bookmark', methods=['GET', 'POST'])
def set_bookmark():
    global providers

    add_ids = request.get_json()["add"]
    remove_ids = request.get_json()["remove"]

    for person in providers:
        if person["id"] in add_ids:
            person["bookmarked"] = True
        if person["id"] in remove_ids:
            person["bookmarked"] = False
    return jsonify(data={})

@app.route('/coffee/<id>')
def coffee(id):
    for person in providers:
        if person["id"] == int(id):
            requested_advisor = person
    return render_template("coffee.html", requested_advisor=requested_advisor)

@app.route('/set_coffee', methods=['GET', 'POST'])
def set_coffee():
    global meeting_requests
    global meeting_id
    addition = request.get_json()["add"]
    print(addition)
    addition['id'] = meeting_id
    meeting_id = meeting_id + 1
    meeting_requests.insert(0, addition)
    return jsonify(data=meeting_requests)

@app.route('/all_coffee')
def all_coffee():
    global meeting_requests
    return render_template("all_coffee.html", coffee=meeting_requests)
if __name__ == '__main__':
   app.run(host='0.0.0.0', debug=True)
