import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string) {
    return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    // set error on matchingControl if validation fails
    if (control.value !== 'Tuna') {
      control.setErrors({ mustMatch: true });
    } else {
      control.setErrors(null);
    }
  };
}
