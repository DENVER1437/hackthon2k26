import pandas as pd
import numpy as np

def preprocess_data(df):

    cols_to_fix = [
        'Declared_Value',
        'Declared_Weight',
        'Measured_Weight',
        'Dwell_Time_Hours'
    ]

    for col in cols_to_fix:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        df[col] = df[col].fillna(df[col].median())

    df = df.fillna("Unknown")

    # ----------------------------
    # FEATURE ENGINEERING
    # ----------------------------

    df['Weight_Gap_Pct'] = abs(
        df['Measured_Weight'] - df['Declared_Weight']
    ) / (df['Declared_Weight'] + 1)

    df['Value_Density'] = df['Declared_Value'] / (
        df['Declared_Weight'] + 1
    )

    df['High_Value_Flag'] = (
        df['Declared_Value'] > 50000
    ).astype(int)

    df['Long_Dwell_Flag'] = (
        df['Dwell_Time_Hours'] > 48
    ).astype(int)

    return df