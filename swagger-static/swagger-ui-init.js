
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_recovery",
          "summary": "Password recovery via Email confirmation. Email should be sent with RecoveryCode inside",
          "description": "",
          "parameters": [
            {
              "name": "password-recovery",
              "in": "header",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailRecoveryDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "Incorrect input data by field"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "summary": "Confirm Password recovery",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "Incorrect input data by field"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "Try login user to the system",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TokenTypeSwaggerDto"
                  }
                }
              }
            },
            "400": {
              "description": "Incorrect input data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refresh",
          "summary": "Generate new pair of access and refresh tokens (in cookie client must send correct refresh Token that will be revoked after refreshing) Device LastActiveDate should\nbe overrode by issued Date of new refresh token",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TokenTypeSwaggerDto"
                  }
                }
              }
            },
            "401": {
              "description": "JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_confirmByCode",
          "summary": "Confirm registration",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConfirmationCodeDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was verified. Account was activated"
            },
            "400": {
              "description": "Incorrect input data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "summary": "Registration in the system. Email with confirmation code will be send to passed email address",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "An email with a verification code has been sent to the specified email address"
            },
            "400": {
              "description": "Incorrect input data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_resending",
          "summary": "Resend confirmation registration Email if user exists",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailRecoveryDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "An email with a verification code has been sent to the specified email address"
            },
            "400": {
              "description": "Incorrect input data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "In cookie client must send correct refresh Token that will be revoked",
          "description": "",
          "parameters": [],
          "responses": {
            "204": {
              "description": "success"
            },
            "401": {
              "description": "JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_getProfile",
          "summary": "Get information about current user",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MeViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/sa/users/{userId}/ban": {
        "put": {
          "operationId": "UsersController_updateBanInfo",
          "summary": "Ban/unban user",
          "description": "",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBanInfoDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Sa-Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/users": {
        "get": {
          "operationId": "UsersController_findUsers",
          "summary": "Returns all users with pagination",
          "description": "",
          "parameters": [
            {
              "name": "banStatus",
              "required": false,
              "in": "query",
              "description": "banStatus by parameters",
              "schema": {
                "default": "all",
                "enum": [
                  "all",
                  "banned",
                  "notBanned"
                ],
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "description": "Search term for user Login: Login should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "searchEmailTerm",
              "required": false,
              "in": "query",
              "description": "Search term for user Email: Email should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/UserViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Sa-Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "post": {
          "operationId": "UsersController_createUser",
          "summary": "Add new user o the system",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "create new user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Sa-Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/users/{userId}": {
        "delete": {
          "operationId": "UsersController_deleteUser",
          "summary": "Delete user specified by id",
          "description": "",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found the user by id"
            }
          },
          "tags": [
            "Sa-Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/blogs/{blogId}/ban": {
        "put": {
          "operationId": "SaController_updateBanInfoForBlog",
          "summary": "Ban/unban blog",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBanInfoForBlogDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "Sa-Blogs"
          ]
        }
      },
      "/sa/blogs/{blogId}/bind-with-user/{userId}": {
        "put": {
          "operationId": "SaController_bindBlog",
          "summary": "Bind Blog with User (if blog doesn't have n owner yet)",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "Sa-Blogs"
          ]
        }
      },
      "/sa/blogs": {
        "get": {
          "operationId": "SaController_findBlogsForSa",
          "summary": "Returns all blogs with pagination",
          "description": "",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/BlogViewForSaModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "Sa-Blogs"
          ]
        }
      },
      "/sa/quiz/questions": {
        "get": {
          "operationId": "SaController_getQuestions",
          "summary": "Returns all questions with pagination and filtering",
          "description": "",
          "parameters": [
            {
              "name": "publishedStatus",
              "required": false,
              "in": "query",
              "description": "banStatus by parameters",
              "schema": {
                "default": "all",
                "enum": [
                  "all",
                  "published",
                  "notPublished"
                ],
                "type": "string"
              }
            },
            {
              "name": "bodySearchTerm",
              "required": false,
              "in": "query",
              "description": "Search term for body",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/QuestionForSaViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "Sa-QuizQuestions"
          ]
        },
        "post": {
          "operationId": "SaController_createQuestion",
          "summary": "Create question",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateQuestionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/QuestionForSaViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "Sa-QuizQuestions"
          ]
        }
      },
      "/sa/quiz/questions/{id}": {
        "delete": {
          "operationId": "SaController_deleteQuestion",
          "summary": "Delete question",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "success"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found the question by id"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "Sa-QuizQuestions"
          ]
        },
        "put": {
          "operationId": "SaController_updateQuestion",
          "summary": "Update question",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateQuestionDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found the question by id"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "Sa-QuizQuestions"
          ]
        }
      },
      "/sa/quiz/questions/{id}/publish": {
        "put": {
          "operationId": "SaController_publishQuestion",
          "summary": "Publish/unpublish question",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PublisherQuestionDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "tags": [
            "Sa-QuizQuestions"
          ]
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "DevicesController_findDevices",
          "summary": "Returns all devices with active sessions for current user",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/DeviceViewModel"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "SecurityDevices"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "DevicesController_deleteDevices",
          "summary": "Terminate all other (exclude current) device's sessions",
          "description": "",
          "parameters": [],
          "responses": {
            "204": {
              "description": "success"
            },
            "401": {
              "description": "JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "SecurityDevices"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/security/devices/{deviceId}": {
        "delete": {
          "operationId": "DevicesController_deleteByDeviceId",
          "summary": "Terminate specified device session",
          "description": "",
          "parameters": [
            {
              "name": "deviceId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "success"
            },
            "401": {
              "description": "JWT refreshToken inside cookie is missing, expired or incorrect"
            },
            "403": {
              "description": "You are not the owner of the device "
            },
            "404": {
              "description": "Not found post"
            }
          },
          "tags": [
            "SecurityDevices"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogs/{blogId}/subscription": {
        "post": {
          "operationId": "BlogsController_subscription",
          "summary": "Subscribe user to blog. Notifications about new posts will be send to Telegram Bot",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found blog"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BlogsController_unSubscription",
          "summary": "Unsubscribe user from blog. Notifications about new posts will not be send to Telegram Bot",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found blog"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/blogs": {
        "get": {
          "operationId": "BlogsGetController_findBlogs",
          "summary": "Returns blogs with pagination",
          "description": "",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/BlogViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{blogId}/posts": {
        "get": {
          "operationId": "BlogsGetController_findPosts",
          "summary": "Returns all posts for specified blog with pagination",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "subscriptionStatus",
              "required": true,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "all",
                "enum": [
                  "all",
                  "onlyFromSubscribedBlogs"
                ],
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/PostViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{id}": {
        "get": {
          "operationId": "BlogsGetController_findOne",
          "summary": "Returns blog by id",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Not found blog"
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogger/blogs/comments": {
        "get": {
          "operationId": "BloggersController_getComments",
          "summary": "Returns all comments for all posts inside ll current user blogs",
          "description": "",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/BloggerCommentsViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Blogs"
          ]
        }
      },
      "/blogger/blogs/{blogId}": {
        "put": {
          "operationId": "BloggersController_updateBlog",
          "summary": "Update existing Blog by id with InputModel",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBlogDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Blogs"
          ]
        },
        "delete": {
          "operationId": "BloggersController_deleteBlog",
          "summary": "Delete blog specified by id",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "success"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            },
            "404": {
              "description": "Not found blog"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Blogs"
          ]
        }
      },
      "/blogger/blogs": {
        "post": {
          "operationId": "BloggersController_createBlog",
          "summary": "Create new Blog",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateBlogDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BloggerViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Incorrect input data for create blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "User not Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Blogs"
          ]
        },
        "get": {
          "operationId": "BloggersController_findBlogsForCurrentBlogger",
          "summary": "Returns all blogs (current blogger) with pagination",
          "description": "",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/BlogViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "User not Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Blogs"
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts": {
        "post": {
          "operationId": "BloggersController_createPost",
          "summary": "Create new Post for specified blog",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Incorrect input data for create post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "User not Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            },
            "404": {
              "description": "Not found blog"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Blogs"
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts/{postId}": {
        "put": {
          "operationId": "BloggersController_updatePost",
          "summary": "Update existing ost by id with InputModel",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "Incorrect input data for update post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "User not Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            },
            "404": {
              "description": "Not found blog"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Blogs"
          ]
        },
        "delete": {
          "operationId": "BloggersController_deletePost",
          "summary": "Delete post specified by id blog",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "success"
            },
            "401": {
              "description": "User not Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            },
            "404": {
              "description": "Not found blog"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Blogs"
          ]
        }
      },
      "/blogger/users/{id}/ban": {
        "put": {
          "operationId": "BloggersController_banUserForCurrentBlog",
          "summary": "Ban/unban user",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBanInfoForUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "Incorrect input data for update post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "User not Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Users"
          ]
        }
      },
      "/blogger/users/blog/{blogId}": {
        "get": {
          "operationId": "BloggersController_getBanedUser",
          "summary": "Returns all banned users or blog",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "description": "Search term for user Login: Login should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/UsersForBanBlogView"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "User not Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogger-Users"
          ]
        }
      },
      "/blogger/blogs/{blogId}/images/wallpaper": {
        "post": {
          "operationId": "BloggersImagesController_uploadPhotoWallpaper",
          "summary": "Upload background wallpaper for Blog (.png or jpg (.ipeg) file (max size is 100KB, width must be 1028, height must be\n312px))",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "file": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Uploaded image information object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogImagesViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "images"
          ]
        }
      },
      "/blogger/blogs/{blogId}/images/main": {
        "post": {
          "operationId": "BloggersImagesController_uploadPhotoMain",
          "summary": "Upload main square image for Blog (.png or jpg (jpeg) file (max size is 100KB, width must be 156, height must be 156))",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "file": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Uploaded image information object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogImagesViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "images"
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts/{postId}/images/main": {
        "post": {
          "operationId": "BloggersImagesController_uploadPhotoMainPost",
          "summary": "Upload main image for Post (.png or jpg (.jpeg) file (max size is\n100KB, width must be 940, height must be 432))",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "file": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Uploaded image information object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostImagesViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "images"
          ]
        }
      },
      "/posts/{postId}/like-status": {
        "put": {
          "operationId": "PostsController_updateLikeStatus",
          "summary": "Make like/unlike/dislike/undislike operation",
          "description": "",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateLikeStatusDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found post"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/posts/{postId}/comments": {
        "get": {
          "operationId": "PostsController_findComments",
          "summary": "Returns all comments for specified post with pagination",
          "description": "",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/CommentViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "404": {
              "description": "Not found post"
            }
          },
          "tags": [
            "Posts"
          ]
        },
        "post": {
          "operationId": "PostsController_createComment",
          "summary": "Create new comment",
          "description": "",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCommentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found post"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/posts": {
        "get": {
          "operationId": "PostsController_findAll",
          "summary": "Returns all posts with pagination",
          "description": "",
          "parameters": [
            {
              "name": "subscriptionStatus",
              "required": true,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "all",
                "enum": [
                  "all",
                  "onlyFromSubscribedBlogs"
                ],
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/PostViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/posts/{id}": {
        "get": {
          "operationId": "PostsController_findOne",
          "summary": "Return post by id",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/comments/{id}/like-status": {
        "put": {
          "operationId": "CommentsController_updateLikeStatus",
          "summary": "Make like/unlike/dislike/undislike operation",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateLikeStatusDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found comment"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/comments/{id}": {
        "put": {
          "operationId": "CommentsController_updateCommentsById",
          "summary": "Update existing comment by id with InputModel",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateCommentDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the comment"
            },
            "404": {
              "description": "Not found comment"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "CommentsController_deleteCommentById",
          "summary": "Delete comment specified by id",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "success"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the comment"
            },
            "404": {
              "description": "Not found comment"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "CommentsController_findOne",
          "summary": "Return comment by id",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Not found comment"
            }
          },
          "tags": [
            "Comments"
          ]
        }
      },
      "/pair-game-quiz/users/top": {
        "get": {
          "operationId": "QuizController_getTop",
          "summary": "Get users top",
          "description": "",
          "parameters": [
            {
              "name": "sort",
              "required": false,
              "in": "query",
              "description": "SORT    Default value : ?sort=avgScores desc&sort=sumScore desc",
              "schema": {
                "default": [
                  "avgScores desc",
                  "sumScore desc"
                ],
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/TopPlayerViewDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/pair-game-quiz/users/my-statistic": {
        "get": {
          "operationId": "QuizController_myStatistic",
          "summary": "Get current user statistic",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/StatisticGameView"
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/pair-game-quiz/pairs/my": {
        "get": {
          "operationId": "QuizController_myGames",
          "summary": "Returns all my games (closed games and current)",
          "description": "",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sort by parameters",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/GameViewModel"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/my-current": {
        "get": {
          "operationId": "QuizController_getCurrentGame",
          "summary": "Returns current unfinished user game",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GameViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found active pair for current user"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/{id}": {
        "get": {
          "operationId": "QuizController_getPairGame",
          "summary": "Returns game by id",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GameViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "The inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Current user is already participating in active pair"
            },
            "404": {
              "description": "Not found game"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/connection": {
        "post": {
          "operationId": "QuizController_connectionQuiz",
          "summary": "Connect current user to existing random pending pair or create new pair which will be waiting second player",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GameViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Current user is already participating in active pair"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/my-current/answers": {
        "post": {
          "operationId": "QuizController_answer",
          "summary": "Send answer for next not answered question in active pair",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AnswerDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AnswerViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Current user is already participating in active pair"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingController_deleteDB",
          "summary": "Clear database: delete all data from all tables/collections",
          "description": "",
          "parameters": [],
          "responses": {
            "204": {
              "description": "success"
            }
          },
          "tags": [
            "Testing"
          ]
        }
      },
      "/integrations/telegram/stripe": {
        "post": {
          "operationId": "StripeController_stripeHook",
          "summary": "Webhook for Stripe Api (see stripeofficial documentation)",
          "description": "",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "integrations"
          ]
        }
      },
      "/integrations/notification": {
        "get": {
          "operationId": "StripeController_sendMessage",
          "summary": "",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "integrations"
          ]
        }
      },
      "/integrations/telegram/webhook": {
        "post": {
          "operationId": "TelegramController_telegramHook",
          "summary": "Webhook for TelegramBot Api (see telegram bot official documentation)",
          "description": "",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "integrations"
          ]
        }
      },
      "/integrations/telegram/auth-bot-link": {
        "get": {
          "operationId": "TelegramController_getLinkTelegramBot",
          "summary": "Get auth bot link with personal user code inside",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "integrations"
          ]
        }
      }
    },
    "info": {
      "title": "Blogger with quiz game",
      "description": "The blogger API description",
      "version": "h29_blogger",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        },
        "basic": {
          "type": "http",
          "scheme": "basic"
        }
      },
      "schemas": {
        "EmailRecoveryDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "Email User for recovery",
              "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
              "example": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "New account recovery password.",
              "minLength": 6,
              "maxLength": 20
            },
            "recoveryCode": {
              "type": "string",
              "description": "Code that be sent via Email inside link"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string",
              "description": "Login or Email  -  User"
            },
            "password": {
              "type": "string",
              "description": "Password User"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "TokenTypeSwaggerDto": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string"
            }
          },
          "required": [
            "accessToken"
          ]
        },
        "FieldError": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string"
            },
            "field": {
              "type": "string"
            }
          },
          "required": [
            "message",
            "field"
          ]
        },
        "ApiErrorResultDto": {
          "type": "object",
          "properties": {
            "errorsMessages": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/FieldError"
              }
            }
          },
          "required": [
            "errorsMessages"
          ]
        },
        "ConfirmationCodeDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Code that be sent via Email inside link",
              "minLength": 1,
              "maxLength": 100
            }
          },
          "required": [
            "code"
          ]
        },
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "description": "login: Login for create/registration User",
              "minLength": 3,
              "maxLength": 10,
              "pattern": "^[a-zA-Z0-9_-]*$",
              "example": "string"
            },
            "email": {
              "type": "string",
              "description": "email: email for create/registration User",
              "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
              "example": "string"
            },
            "password": {
              "type": "string",
              "description": "password: password for create/registration User",
              "minLength": 6,
              "maxLength": 20
            }
          },
          "required": [
            "login",
            "email",
            "password"
          ]
        },
        "MeViewDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "login",
            "userId"
          ]
        },
        "UpdateBanInfoDto": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "rue - for ban user, false - for unban user",
              "default": false
            },
            "banReason": {
              "type": "string",
              "description": "Password User",
              "minLength": 20
            }
          },
          "required": [
            "isBanned",
            "banReason"
          ]
        },
        "PaginationViewDto": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array"
            },
            "pagesCount": {
              "type": "number"
            },
            "page": {
              "type": "number"
            },
            "pageSize": {
              "type": "number"
            },
            "totalCount": {
              "type": "number"
            }
          },
          "required": [
            "items",
            "pagesCount",
            "page",
            "pageSize",
            "totalCount"
          ]
        },
        "BanInfoType": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean"
            },
            "banDate": {
              "type": "string"
            },
            "banReason": {
              "type": "string"
            }
          },
          "required": [
            "isBanned",
            "banDate",
            "banReason"
          ]
        },
        "UserViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "banInfo": {
              "$ref": "#/components/schemas/BanInfoType"
            }
          },
          "required": [
            "id",
            "login",
            "email",
            "createdAt",
            "banInfo"
          ]
        },
        "UpdateBanInfoForBlogDto": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "isBanned: \"boolean\" for update status ban or unban User"
            }
          },
          "required": [
            "isBanned"
          ]
        },
        "BlogOwnerInfoType": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string"
            },
            "userLogin": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "userLogin"
          ]
        },
        "BanInfoForBlogType": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean"
            },
            "banDate": {
              "type": "string"
            }
          },
          "required": [
            "isBanned",
            "banDate"
          ]
        },
        "BlogViewForSaModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "isMembership": {
              "type": "boolean"
            },
            "blogOwnerInfo": {
              "$ref": "#/components/schemas/BlogOwnerInfoType"
            },
            "banInfo": {
              "$ref": "#/components/schemas/BanInfoForBlogType"
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt",
            "isMembership",
            "blogOwnerInfo",
            "banInfo"
          ]
        },
        "QuestionForSaViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "body": {
              "type": "string"
            },
            "correctAnswers": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "published": {
              "type": "boolean"
            },
            "createdAt": {
              "type": "string"
            },
            "updatedAt": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "body",
            "correctAnswers",
            "published",
            "createdAt",
            "updatedAt"
          ]
        },
        "CreateQuestionDto": {
          "type": "object",
          "properties": {
            "body": {
              "type": "string",
              "description": "body: Text of question, for example: How many continents are there",
              "minLength": 10,
              "maxLength": 500
            },
            "correctAnswers": {
              "description": "correctAnswers: All variants of possible correct answers for current questions Examples: [6, 'six', 'шесть', 'дофига'] In Postgres save this data in JSON column",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "body",
            "correctAnswers"
          ]
        },
        "PublisherQuestionDto": {
          "type": "object",
          "properties": {
            "published": {
              "type": "boolean",
              "description": "published: True if question is completed and can be used in the Quiz game",
              "default": true
            }
          },
          "required": [
            "published"
          ]
        },
        "DeviceViewModel": {
          "type": "object",
          "properties": {
            "ip": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "lastActiveDate": {
              "type": "string"
            },
            "deviceId": {
              "type": "string"
            }
          },
          "required": [
            "ip",
            "title",
            "lastActiveDate",
            "deviceId"
          ]
        },
        "PhotoSizeModel": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string"
            },
            "width": {
              "type": "number",
              "description": "In pixels"
            },
            "height": {
              "type": "number",
              "description": "In pixels"
            },
            "fileSize": {
              "type": "number",
              "description": "In bytes"
            }
          },
          "required": [
            "url",
            "width",
            "height",
            "fileSize"
          ]
        },
        "BlogImagesViewModel": {
          "type": "object",
          "properties": {
            "wallpaper": {
              "$ref": "#/components/schemas/PhotoSizeModel"
            },
            "main": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PhotoSizeModel"
              }
            }
          },
          "required": [
            "wallpaper",
            "main"
          ]
        },
        "BlogViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "isMembership": {
              "type": "boolean"
            },
            "images": {
              "$ref": "#/components/schemas/BlogImagesViewModel"
            },
            "currentUserSubscriptionStatus": {
              "enum": [
                "Subscribed",
                "Unsubscribed",
                "None"
              ],
              "type": "string"
            },
            "subscribersCount": {
              "type": "number"
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt",
            "isMembership",
            "images",
            "currentUserSubscriptionStatus",
            "subscribersCount"
          ]
        },
        "LikeDetailsViewModel": {
          "type": "object",
          "properties": {
            "addedAt": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            },
            "login": {
              "type": "string"
            }
          },
          "required": [
            "addedAt",
            "userId",
            "login"
          ]
        },
        "ExtendedLikesInfoViewModel": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number"
            },
            "dislikesCount": {
              "type": "number"
            },
            "myStatus": {
              "type": "string"
            },
            "newestLikes": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/LikeDetailsViewModel"
              }
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus",
            "newestLikes"
          ]
        },
        "PostImagesViewModel": {
          "type": "object",
          "properties": {
            "main": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PhotoSizeModel"
              }
            }
          },
          "required": [
            "main"
          ]
        },
        "PostViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            },
            "blogName": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "extendedLikesInfo": {
              "$ref": "#/components/schemas/ExtendedLikesInfoViewModel"
            },
            "images": {
              "$ref": "#/components/schemas/PostImagesViewModel"
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo",
            "images"
          ]
        },
        "LikeInfoViewModel": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number"
            },
            "dislikesCount": {
              "type": "number"
            },
            "myStatus": {
              "type": "string"
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus"
          ]
        },
        "CommentatorInfoModel": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string"
            },
            "userLogin": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "userLogin"
          ]
        },
        "PostInfoModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            },
            "blogName": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "title",
            "blogId",
            "blogName"
          ]
        },
        "BloggerCommentsViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "likesInfo": {
              "$ref": "#/components/schemas/LikeInfoViewModel"
            },
            "commentatorInfo": {
              "$ref": "#/components/schemas/CommentatorInfoModel"
            },
            "postInfo": {
              "$ref": "#/components/schemas/PostInfoModel"
            }
          },
          "required": [
            "id",
            "content",
            "createdAt",
            "likesInfo",
            "commentatorInfo",
            "postInfo"
          ]
        },
        "UpdateBlogDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "name: Blog name for update",
              "minLength": 1,
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "description": "description",
              "minLength": 1,
              "maxLength": 500
            },
            "websiteUrl": {
              "type": "string",
              "description": "websiteUrl: Blog website Url",
              "minLength": 1,
              "maxLength": 100
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "CreateBlogDto": {
          "type": "object",
          "properties": {
            "websiteUrl": {
              "type": "string",
              "description": "websiteUrl: Blog website Url",
              "minLength": 1,
              "maxLength": 100,
              "pattern": "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n",
              "example": "string"
            },
            "name": {
              "type": "string",
              "description": "name: Blog name",
              "minLength": 1,
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "description": "description",
              "minLength": 1,
              "maxLength": 500
            }
          },
          "required": [
            "websiteUrl",
            "name",
            "description"
          ]
        },
        "BloggerViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "isMembership": {
              "type": "boolean"
            },
            "images": {
              "$ref": "#/components/schemas/BlogImagesViewModel"
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt",
            "isMembership",
            "images"
          ]
        },
        "CreatePostDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Title for create Post",
              "minLength": 1,
              "maxLength": 30
            },
            "shortDescription": {
              "type": "string",
              "description": "Short description for create Post",
              "minLength": 1,
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "description": "content for create Post",
              "minLength": 1,
              "maxLength": 1000
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "UpdateBanInfoForUserDto": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "isBanned: User",
              "default": true
            },
            "banReason": {
              "type": "string",
              "description": "password: password User",
              "minLength": 20
            },
            "blogId": {
              "type": "string",
              "description": "id for Blog"
            }
          },
          "required": [
            "isBanned",
            "banReason",
            "blogId"
          ]
        },
        "UsersForBanBlogView": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "banInfo": {
              "$ref": "#/components/schemas/BanInfoType"
            }
          },
          "required": [
            "id",
            "login",
            "banInfo"
          ]
        },
        "UpdateLikeStatusDto": {
          "type": "object",
          "properties": {
            "likeStatus": {
              "description": "Send \"None\" if you want to un \"like\" or \"undislike\"",
              "default": "None",
              "enum": [
                "None",
                "Like",
                "Dislike"
              ],
              "type": "string"
            }
          },
          "required": [
            "likeStatus"
          ]
        },
        "CommentViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            },
            "userLogin": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "likesInfo": {
              "$ref": "#/components/schemas/LikeInfoViewModel"
            }
          },
          "required": [
            "id",
            "content",
            "userId",
            "userLogin",
            "createdAt",
            "likesInfo"
          ]
        },
        "CreateCommentDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "content for create Comment",
              "minLength": 20,
              "maxLength": 300
            }
          },
          "required": [
            "content"
          ]
        },
        "UpdateCommentDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "description for update comment",
              "minLength": 20,
              "maxLength": 300
            }
          },
          "required": [
            "content"
          ]
        },
        "PLayerViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "login"
          ]
        },
        "TopPlayerViewDto": {
          "type": "object",
          "properties": {
            "player": {
              "description": "Sum scores of all games //Сумма очков всех игр",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PLayerViewModel"
                }
              ]
            },
            "sumScore": {
              "type": "number",
              "description": "Sum scores of all games //Сумма очков всех игр"
            },
            "avgScores": {
              "type": "number",
              "description": "Average score of all games rounded to 2 decimal places //Средний балл по всем играм округлен до 2 знаков после"
            },
            "gamesCount": {
              "type": "number",
              "description": "All played games count //Учитываются все сыгранные игры"
            },
            "winsCount": {
              "type": "number"
            },
            "lossesCount": {
              "type": "number"
            },
            "drawsCount": {
              "type": "number"
            }
          },
          "required": [
            "player",
            "sumScore",
            "avgScores",
            "gamesCount",
            "winsCount",
            "lossesCount",
            "drawsCount"
          ]
        },
        "StatisticGameView": {
          "type": "object",
          "properties": {
            "sumScore": {
              "type": "number",
              "description": "Sum scores of all games //Сумма очков всех игр"
            },
            "avgScores": {
              "type": "number",
              "description": "Average score of all games rounded to 2 decimal places //Средний балл по всем играм округлен до 2 знаков после"
            },
            "gamesCount": {
              "type": "number",
              "description": "All played games count //Учитываются все сыгранные игры"
            },
            "winsCount": {
              "type": "number"
            },
            "lossesCount": {
              "type": "number"
            },
            "drawsCount": {
              "type": "number"
            }
          },
          "required": [
            "sumScore",
            "avgScores",
            "gamesCount",
            "winsCount",
            "lossesCount",
            "drawsCount"
          ]
        },
        "AnswerViewModel": {
          "type": "object",
          "properties": {
            "questionId": {
              "type": "string"
            },
            "answerStatus": {
              "enum": [
                "Correct",
                "Incorrect"
              ],
              "type": "string"
            },
            "addedAt": {
              "type": "string"
            }
          },
          "required": [
            "questionId",
            "answerStatus",
            "addedAt"
          ]
        },
        "GamePlayerProgressViewModel": {
          "type": "object",
          "properties": {
            "answers": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/AnswerViewModel"
              }
            },
            "player": {
              "$ref": "#/components/schemas/PLayerViewModel"
            },
            "score": {
              "type": "number"
            }
          },
          "required": [
            "answers",
            "player",
            "score"
          ]
        },
        "QuestionShortViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "body": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "body"
          ]
        },
        "GameViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "firstPlayerProgress": {
              "$ref": "#/components/schemas/GamePlayerProgressViewModel"
            },
            "secondPlayerProgress": {
              "$ref": "#/components/schemas/GamePlayerProgressViewModel"
            },
            "questions": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/QuestionShortViewModel"
              }
            },
            "status": {
              "enum": [
                "PendingSecondPlayer",
                "Active",
                "Finished"
              ],
              "type": "string"
            },
            "pairCreatedDate": {
              "type": "string"
            },
            "startGameDate": {
              "type": "string"
            },
            "finishGameDate": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "firstPlayerProgress",
            "secondPlayerProgress",
            "questions",
            "status",
            "pairCreatedDate",
            "startGameDate",
            "finishGameDate"
          ]
        },
        "AnswerDto": {
          "type": "object",
          "properties": {
            "answer": {
              "type": "string",
              "description": "answer: Text of answer, for example: 'free'"
            }
          },
          "required": [
            "answer"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
