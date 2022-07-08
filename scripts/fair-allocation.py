import pandas

if __name__== "__main__":
    # Read the file
    filepath = "./test.csv"
    df = pandas.read_csv(filepath)
    columns = list(df.columns)
    # Ask user the column for name
    
    name_index = input(
        f"Column number of name: {[(i, c) for i, c in enumerate(columns)]} "
    )
    name_column = columns[int(name_index)]
    # Ask user about random order column
    # is there a column which specifies the order in alphanumeric order? 
    # Random order determined by program? 
    if input("Is there a column which specifies the order in alphanumeric order? ") == "Y":
        order_index = input(
        f"Column number of order: {[(i, c) for i, c in enumerate(columns)]} "
    )
        df = df.sort_values(by=[columns[order_index]])
    else:
        df = df.sample(frac=1).reset_index(drop=True)
    # Ask user the column for choices
    print(df)
    print("For each of the columns, indicate if they represent the respondent's choices. 1 for yes, 0 for no ")
    choice_columns = []
    for col in columns:
        if input(col) == "1": choice_columns.append(col)
        # need to indicate the order of the columns 
    choices = set()
    for col in choice_columns:
        for opt in df[col].unique():
            choices.add(opt)
    # Ask user to confirm the choices & limits
    print("For each option, indicate how many vacancies there are ")
    availabilities = {}
    for choice in choices:
        availabilities[choice] = int(input(f"{choice}: "))
    print(availabilities)
    # Make the passes
    # put it in a list like this: [ (user, [options]) ]
    values = df.loc[:,[name_column] + choice_columns]
    print(values)
    values = [ (v[1], v[2:]) for v in values.itertuples() ]
    print(values)
    allocations = { n:[] for n in df[name_column].values }
    # add name to the event too? 
    for _ in range(len(choices)):
        for row in values:
            for c in row[1]:
                if c and availabilities[c] > 0:
                    allocations[row[0]].append(c)
                    availabilities[c] -= 1
                    break
        values.reverse()
    print(allocations)
    print(availabilities)
