import styled from '@emotion/styled'

export const StyledButton = styled.button({
  display: "flex",
  flexDirection: "column",
  padding: "8px 10px",
  margin: "0px 0px 20px 0px",
  cursor: "pointer",
  backgroundColor: "white",
  color: "black",
  borderStyle: "solid",
  borderRadius: "5px",
  fontSize: "1.1rem",
  "&:hover": {
    backgroundColor: "#EEE",
  },
  placeContent: "center",
})
