import request from "supertest";
import app from "../../../app";

export function runGeneralRoutesTests() {
  describe("General Routes", () => {
    it("should access the home page", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("text/html"),
      );
    });
    it("should access the about page", async () => {
      const response = await request(app).get("/about");
      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("text/html"),
      );
    });
    it("should access the contact page", async () => {
      const response = await request(app).get("/contact");
      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("text/html"),
      );
    });
  });
}
