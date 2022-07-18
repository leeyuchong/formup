import pandas as pd
import numpy as np

na_test = {
    "1st choice": ["A", "A", "B", "A", "B", "C", "C", "B"],
    "2nd choice": ["B", "B", "C", "C", "A", "", "B", "A"],
    "3rd choice": ["C", "C", "A", "B", "C", "", "A", "C"],
}

no_ties_test = {
    "1st choice": ["A", "B", "A", "A", "B", "C", "C", "B"],
    "2nd choice": ["B", "A", "C", "C", "A", "B", "B", "A"],
    "3rd choice": ["C", "C", "B", "B", "C", "A", "A", "C"],
}
b_test = {
    "1st choice": ["A", "B", "A", "A", "C", "C", "C", "A"],
    "2nd choice": ["B", "C", "C", "C", "B", "A", "B", "C"],
    "3rd choice": ["C", "B", "B", "B", "A", "B", "A", "B"],
}
repeated_test = {
    "1st choice": ["A", "B", "A", "A", "B", "A", "B", "C"],
    "2nd choice": ["B", "A", "C", "C", "A", "A", "C", "A"],
    "3rd choice": ["C", "C", "B", "B", "C", "A", "A", "B"],
}

tie_all_the_way = {
    "1st choice": ["A", "B", "A", "A", "B", "C", "C"],
    "2nd choice": ["B", "A", "C", "C", "A", "B", "A"],
    "3rd choice": ["C", "C", "B", "B", "C", "A", "B"],
}

c_test = {
    "1st choice": ["A", "B", "A", "A", "B", "B", "C", "C"],
    "2nd choice": ["B", "A", "C", "C", "A", "A", "B", "A"],
    "3rd choice": ["C", "C", "B", "B", "C", "C", "A", "B"],
}

d_test = {
    "1st choice": ["A","B","C","D","A","B"],
    "2nd choice": ["C","D","A","A","C","C"],
    "3rd choice": ["D","C","B","B","D","D"],
    "4th choice": ["B","A","D","C","B","A"],
}

df = pd.DataFrame(no_ties_test)
choices = df.stack().drop_duplicates().values
na_present = False
if "" in choices:
    na_present=True
    choices = np.delete(choices, np.where(choices==""))

order_mapping = {
    "1st choice": 1,
    "2nd choice": 2,
    "3rd choice": 3,
    "4th choice": 4,
}
vote_rounds = pd.DataFrame()

df_converted= pd.DataFrame([], columns=choices, index=df.index)
for choice in choices:
    for col in reversed(df.columns): # reversed to prioritise the higher placing for repeated choices
        df_converted.loc[df.loc[df[col]==choice].index, choice] = order_mapping[col]
if df_converted.isnull().values.any() or na_present:
    choices = np.delete(choices, np.where(choices==""))

df_converted = df_converted.astype("float")
df_t = df_converted.transpose()
vote_rounds[0] = df_t.idxmin().values
losers = []
winner = ""
winning_count = (len(df)//2) + 1
for r in range(1, df.shape[1]+1):
    aggregate = vote_rounds[r-1].value_counts()
    winning_check = aggregate[aggregate>=winning_count]
    if len(winning_check)==1:
        winner = winning_check.index[0]
        print("Winner", winner)
        break
    vote_rounds[r] = vote_rounds[r-1]
    min_vote = aggregate.min()
    potential_losers = tuple(aggregate.loc[aggregate==min_vote].index)
    candidate_to_drop = ""
    if len(potential_losers)==1:
        print("check A")
        candidate_to_drop = potential_losers[0]
    else:
        df_potential_losers = df_converted.loc[:,potential_losers]
        df_potential_losers_counts = pd.DataFrame([], columns=potential_losers, index=range(1,len(choices)+1))
        for pl in potential_losers:
            df_potential_losers_counts[pl] = df_potential_losers[pl].value_counts()
        # drop option with fewer first place votes
        first_place = df_potential_losers_counts.loc[1]
#         fewest_first_place = first_place==first_place.min()
        
        least_first_place = first_place[first_place==first_place.min()]
        if len(least_first_place)==1:
            print("check B")
            candidate_to_drop = least_first_place.index[0]
        else:
            # drop option with more last place votes
            last_place = df_potential_losers_counts.loc[len(choices)]
#             most_last_place = last_place==last_place.max()
            most_last_place = last_place[last_place==last_place.max()]
            if len(most_last_place) == 1:
                print("check C")
                candidate_to_drop = most_last_place.index[0]
            else:
                # drop option with highest sum
                potential_losers_sum = df_potential_losers.sum()
                highest_sum = potential_losers_sum.max()
                highest_candidate_sum = potential_losers_sum[potential_losers_sum==highest_sum]
                if len(highest_candidate_sum)==1:
                    print("check D")
                    candidate_to_drop = highest_candidate_sum.index[0]
                else:
                    raise Exception("Draw all the way")
    print(f"Drop {candidate_to_drop}")
    losers.append(candidate_to_drop)
    voters_with_losing_candidate = vote_rounds.loc[vote_rounds[r]==candidate_to_drop].index
    next_choices = df_converted.loc[voters_with_losing_candidate,(~df_converted.columns.isin(losers))]
    next_choices_t = next_choices.transpose()
    new_votes = next_choices_t.idxmin().values
    vote_rounds.loc[voters_with_losing_candidate, r] = new_votes
for rnd in vote_rounds.columns:
    print(vote_rounds[rnd].value_counts())


