let baseURL = ""
if (process.env['NODE_ENV'] !== "dev") {
	baseURL = "/~boucan/persistes"
}
else {
	baseURL = "/"

}

export default baseURL