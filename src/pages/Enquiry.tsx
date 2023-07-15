import { Button, Grid, TextField } from "@mui/material";
// import themeStore from "../store/ThemeStore";
import { observer } from "mobx-react-lite";

const Enquiry = observer(() => {
  const handleSubmit = () => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const enquiryInput = document.getElementById("enquiry") as HTMLInputElement;
    const email = emailInput.value;
    const enquiry = enquiryInput.value;

    const body = `Email: ${email}%0D%0A%0D%0AEnquiry:%0D%0A${enquiry}`;

    const mailtoLink = `mailto:officialcommoncents@gmail.com?subject=CommonCents User Enquiry&body=${body}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="enquiry-container">
      <h5 className="enquiry-title" style={{borderBottom: '1px solid #888'}}>Help and Support </h5>
      <div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={0} columns={12}>
              <Grid item xs={6} className="form-field1">
                <TextField
                  variant="outlined"
                  label="Email"
                  type="email"
                  fullWidth
                  style={{
                    width: "30vw",
                    height: "97px",
                    borderRadius: "20px",
                    marginTop: "10px",
                    marginLeft: "15px",
                  }}
                  required
                  id="email"
                />
              </Grid>
              <Grid item xs={12} className="form-field2">
                <TextField
                  variant="outlined"
                  label="Enquiry"
                  type="textarea"
                  fullWidth
                  multiline
                  rows={7}
                  style={{
                    width: "60vw",
                    height: "217px",
                    marginLeft: "15px",
                    borderRadius: "20px",
                  }}
                  required
                  id="enquiry"
                />
              </Grid>
              <Grid item xs={12} className="button-container">
                <Button
                  variant="contained"
                  size="large"
                  style={{
                    backgroundColor: "#0033ff",
                    width: "22vw",
                    height: "40px",
                    transform: 'translateX(39vw)',
                    // marginLeft: "50vw",
                  }}
                  type="submit"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Enquiry;
