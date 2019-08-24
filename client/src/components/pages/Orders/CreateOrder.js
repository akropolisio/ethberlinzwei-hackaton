import React from 'react';
import { Form as FinalForm, Field as FinalField, FormSpy } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Grid, Button, Typography, MenuItem, Select, OutlinedInput, FormControl } from '@material-ui/core';

function SelectAdapter({ input, children, ...rest }) {
  return (
    <FormControl variant="outlined">
      <Select {...input} {...rest} input={<OutlinedInput />}>
        {children}
      </Select>
    </FormControl>
  );
}

function CreateOrder() {
  const _handleFormSubmit = React.useCallback(values => {
    console.log('SUBMIT >>>', values);
  }, []);

  return (
    <FinalForm
      onSubmit={_handleFormSubmit}
      subscriptions={{ submitting: true, pristine: true }}
      initialValues={{ targetCurrency: 'FBT' }}
    >
      {({ handleSubmit, submitting, pristine }) => (
        <Grid component="form" onSubmit={handleSubmit} container spacing={2} direction="column">
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography>I want to buy</Typography>
              </Grid>
              <Grid item>
                <FinalField name="targetValue" component={TextField} required variant="outlined" />
              </Grid>
              <Grid item>
                <FinalField name="targetCurrency" component={SelectAdapter} required>
                  <MenuItem value="WETH">WEther</MenuItem>
                  <MenuItem value="FBT">Facebook Token</MenuItem>
                </FinalField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography>for</Typography>
              </Grid>
              <Grid item>
                <FinalField name="sourceValue" component={TextField} required variant="outlined" />
              </Grid>
              <Grid item>
                <FormSpy>
                  {({ values }) => (
                    <Typography>
                      {
                        {
                          FBT: 'WEther',
                          WETH: 'FBToken',
                        }[values.targetCurrency]
                      }
                    </Typography>
                  )}
                </FormSpy>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary" disabled={submitting || pristine}>
              Create Order
            </Button>
          </Grid>
        </Grid>
      )}
    </FinalForm>
  );
}

export default CreateOrder;
