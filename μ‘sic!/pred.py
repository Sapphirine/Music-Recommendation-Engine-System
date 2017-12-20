from sklearn.externals import joblib
#joblib.dump(model,'lgb.pkl')
#model = joblib.load('lgb.pkl')
import pandas as pd

def get_result(bd,city,gender): 
    model = joblib.load('lgb.pkl')
    test = pd.read_csv('test.csv')
    #print(test.shape)
    bd = [bd]*test.shape[0]
    
    test['bd'] = bd
    test['city'] = [city]*test.shape[0]
    if(gender == 1):
        test['female'] = [1]*test.shape[0]
        test['male'] = [0]*test.shape[0]
    else:
        test['male'] = [1]*test.shape[0]
        test['female'] = [0]*test.shape[0]
    songid = test['song_id']
    #print(test.drop(['Unnamed: 0','msno','target','song_id'],axis = 1).columns)
    
    preds = model.predict(test.drop(['Unnamed: 0','msno','target','song_id'],axis = 1).values)
    song_prob = [(preds[i], songid[i]) for i in range(len(preds))]
    #print(song_prob)
    sorted_song = sorted(song_prob)
    table = {}
    for i in range(len(sorted_song)-1,-1,-1):
        if sorted_song[i][1] not in table:
            table[sorted_song[i][1]] = 1
        if len(table.keys()) == 10:
            break
    return list(table.keys())
    
print(get_result(1,3,1))