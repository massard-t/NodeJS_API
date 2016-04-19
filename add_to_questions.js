var mysql = require("mysql");
var query = `INSERT INTO question (numero, intitule) VALUES (?, ?);`;
const question = {
1:"Faites vous du sport, si oui lesquelles ?",
2:"Si vous faites de la natation, quelles nages pratiquez vous ?",
3:"Si vous faites de la course, quelles types de courses pratiquez vous ? Sur quel type de terrain ?",
4:"Depuis combien de temps pratiquez vous ces sports ? A quelle frequence ?",
5:"Quels types de baskets portez vous ? Semelles orthopediques ? Si oui, seulement pour faire du sport ?",
6:"Probleme medicaux ? (migraineux, cardiaque, digestif, renaux, pulmonaire...)",
7:"Avez vous des problemes de vue ?",
8:"Avez vous deja eu un accident de la route ? Si oui, avez vous eu une perte de conscience ? De combien de temps ? Imagerie faite ?",
9:"Avez vous deja eu des fractures ? Entorses ? (traitement, duree...)",
10:"Etes vous diabetique ? Si oui de quel type ?",
11:"Avez-vous déjà subit un test DMO ?",
12:"Avez-vous déjà pris des médicaments à risque élevé ? (usage à long terme de glucocorticoïdes, d'inhibiteurs de l'aromatase, de traitement  de privation androgénique), polyarthrite rhumatoïde...)",
13:"Avez-vous d'autres problèmes de santé contribuant à la perte osseuse ?",
14:"Avez-vous des antécédents de maux de dos?",
15:"Portez-vous des prothèses ?(prothèse de hanche...) Si oui, depuis quand ? Si oui, faîtes-vous encore de la rééducation ?",
16:"Avez-vous des traitement(s) en cours ? Si oui, pourquoi ? Depuis quand ?",
17:"Avez-vous d'autre(s) médication(s) ?",
18:"Quelle alimentation avez-vous ?",
19:"Suivez-vous un régime ? Si oui, depuis quand? Quel type de régime?",
20:"Avez-vous été conseillé par un spécialiste ?(nutritionniste, diététicien...) Si oui, quel est le but du régime ? (Pour problème de santé, conseillé par médecin, en prévention de problème de santé...) Depuis combien de temps suivez-vous ce régime ? Les résultats sont-ils satisfaisants ?",
21:"Quelle est la qualité de votre sommeil ?",
22:"Vous sentez-vous reposé au réveil ?",
23:"Combien d'heures dormez-vous par nuit ?",
24:"Quelle quantité d'eau buvez-vous par jour ?",
25:"Prenez-vous des compléments ? des vitamines ?"};

function TransformJSONarrayBi(js_obj, fields) {
    // console.log(js_obj)
    const parsed_data = js_obj;
    // const parsed_data = JSON.parse(js_obj);
    // console.log("DE" + parsed_data + "FI");
    if (parsed_data === 'undefined')
        return (false);
    var res_final = [];
    for (var field in parsed_data)
    {
        var res_array = [];
        res_array.push(field);
        res_array.push(parsed_data[field]);
        res_final.push(res_array);
    }
    return (res_final);
}

function DefineDB() {
    const connection = mysql.createConnection({
        host     : '0.0.0.0',
        user     : 'robotbobtm',
        database : 'asptt'
    });
    connection.connect();
    return (connection);
}

function Foreach_Add(js_obj) {
    const bdd = DefineDB();
    const values = js_obj;
    const request = bdd.format(query, values);
    console.log(request);
    bdd.query(request, function(err, rows){
        if (err){throw err}
        else {console.log("worked fine")}
    });
    bdd.end();
}
var count = 0;
const js_obj = TransformJSONarrayBi(question);
// console.log(js_obj);

const size = js_obj.length;
while (count < size) {
    console.log(`Passage ${count}`);
    Foreach_Add(js_obj[count]);
    count = count + 1;
}

console.log("EVERYTHING WORKED FINE YAY");