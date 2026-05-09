  const EMPRESA = { nome: 'Zello Ambiental', eng: 'Eng. Guilherme Montanari', crea: 'CREA 5069519852', tel: '(16) 98142-7633', email: 'contato@zelloambiental.com.br' };
  const LOGO_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAYAAACPZlfNAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAd8UlEQVR4nO2de7DlVXXnP/vx+/3O+9zT9/b7ATTdPJs3KAEUEAIoURFF1CFK1AQxIZWKY6bKSqJTSXQmU0kmElMxkxjzIGZ0GCOKJAgxCEgUBDE+QEAEmn7f13n9XnvvNX+c263thckMKe8D77fqVnVVn3t+67c+Z+3f2mutfa4SEVa0fKQX24AV/f9pBdgy0wqwZaYVYMtMK8CWmVaALTOtAFtmWgG2zLQCbJlpBdgy0wqwZaYVYMtMK8CWmVaALTP9xAH76de+bln3k36igF37nz8oF1559WKb8e/STwyw6278mOxNHV0vNLeftmyjzC62AT9uqfqR8uZffQ9SrdHprMfGVdasX7PYZr1gvagjTNWOkFe+5e3YyjjDwlCGCB8sxx5/3GKb9oL1ogZ24RVXsf7I40nLiFISCm9Zv2ELtXp9sU17wXrRArvoml+VTVtPYGpQQtJETAVMjFjNtm3bFtu8F6wXJbCXv/UG2bz9ZFzUIGp02D/bQ1cSJtatJc0yPMs253jxAXv5235FNh59MikJqViGpaO5qkVWDFmzdhX1RhUX/GKb+YL1ogJ25lXvki3HnEFJE1Mdp1QRtpow1Z1kfKJBsxWDKpncv2+xTX3BetEAO+rCK2TbSWcg8RjONOimHq8seShoNGNWr22Rl13KYsj05ORim/uC9aIAtvXlr5IzzrsIU1tFQYzYKjlgE0tZZoy1K0yMNxA3IFLCnl3PLrbJL1jLHtiq439Kzr/kCloTm+hmgaEP5CI0Wy1KX1CrWcbHm8TGExswOvD9J7+32Ga/YC1rYNGmHfK6N72TqLaOmUEgaY0hkSEPGSYOOJ+yfu04E2NNiuGQqo3pTU+x/6EH1GLb/kK1rIG98/pfpj2xhV6qIarjlEFFGl2B2cEU6zdM0G43SCKLywt0EB779iPz3ueq6967bPL8ZQvshv9yo0TVOrv29lFxB1NpMCxyvHZECdSalrXrOhgd8KUj0ob+zCz33H33Ye+z7fTzpdYc4y2/9L5lAW3ZAVPtDfLq93xA+iGi1BXq7RYoxzDt0hyrU4acoEu2H7MFFwaIz3FlTtXGzEzN8sjnP3fYcji26Ug2HXsKs3nMq976a0se2rICplqb5aQ3vJmJHWcyY9sUlTpFmKFaHZAkjkF/monVbbYcsZE0m8VGnigJ+HKIhMCtf/+5ee+59czzGNY3UMSboHIEO376nUsa2rIC1j7xZHacdQ77Bzm18fVM545ap0U36+JCzlinQaUSozXoyOIl0O/NEGvPzscf4ZFbbjosulYdfZKMbTyK2RDTXruVgYtYv/kY6tvPW7LQlg0wte5Y+bnrrifkwlh1DPEgGPb2Ukyjw/qNmxjvtImMoSw9eanwYmk12qgi5yMffP+89zz15ZcR11uICFElIU6qKBvxkpeeuwh3+P+mZQPsF9//AXrDnEatiSoE7wQdVZGoSrUzgRhLVjjiOCY2ES4vME7QZcl//9BvIbueOSy6kq1nyRkXvJKh87hQEiURyhrS3DO+eh3NY1+yJKNsWQB7/e/8vvhalVIZfCmIg0qtjjea9uo1OGXx2oKxDAcZ4hx1azFFyl98+A+YeuCr8/Zd17z7Pcx6Qw6UoaTVbjPIcmqtMaa7BaefuTSjbMkDO/MdvyirjzqaHEMRFEpb6q0mM/0+zVVj6MhQFBk6ijEmosxyOpWEuOhz3+238P0vfHYerLPfdIO01x1BKhpBE0URhS+wSUwpmqAiOhObUa1jllyULWlgW17xGnnJ+RfTTR39tKTebqOimEFeUOk0CRoi7Uh0YNCdJRv0GavFlLP7eOALn+XeP71xHqztP32NnPGKy9kz08UkFbz3aK3JihwdR/TSnKjWYZAJR594+mLc9v9VSxZYtP10ufiKK+mXgo1qrFq1hkE/J/ceU4+x1QjnM4bdKTr1iFYELQs26/IPn7qJf/7oh+fBslvPkcvf9HaGEqOSCs6P+mLD4ZBWu0G/P8RGVZwYnETsOOVMlNqwpKJsyQJ753t/DV9rUam1GfZzfOZptzt4CyoxmESRZl1qkSKb3k9LO6LhAW75iz/m25/6q3mwVp18sbzxHTeQqipDsdikjnMB0CRRRK/XA60QZQlYlE4QLKilNVi2JIFd8iu/KVmcYJpt0tSzfmI9RVZSZimtsSazgyl63Uk2rF1F1SrqSujtepK/vvG/8eTtt8yDNX7CeXLpa99MbXwdw6CIqw2mez2Sag0VFOJh2B9gjAEV4dAEDE4EJCyGC55XSw7YEee/Rk47/wJcXMHbBGsrDLoZlSgmL1KmpvfRaiS0EkV/327KwYDu3l18/A9/lwP33zMP1urTLpVXXf3zNNcfgbIx1lr6/T61Rpt+WmAwKAfd6S7WRAgaHzSCxQeorBpbBC88v5ZUvNc2nijv+I3fZDYrUXGdvBRqOsJLThJFVHSMNZ7I5xTpgLY2fPfrD3PHn/8p0jt8n6UmNsrqo07mkqt+jurEBgKWyZkutZai1axzoNenWqmgiQhFRr/bw+qYPMw9spQhoLngwvMWwxXPqyUF7I3XX0dtYjX7Uo+NK5S+xCtNqYT901OsW9Mh7R/A5I4JLdzyd3/L4/98L0TzF4qTz7uMU152Gaa+hqlMiCJNUmsiIpRlSWw0Vht0ENI0o8hyTDVCRAgCEhmUFjZv3rgInnh+LZkl8bjXXC2bTziBycGQZquDSx2WmEGakwOdteM8u+spKgrU7Cx//Nu/zWO3fUpJuktJd+eh6FKrj5bL3vUbcsyZ51Mf38RU6hBbpZ87omqDUqDX69FpNwjpgHKYMZjtY5QCH1AYAA5+adrXvn7/ovjj+bQkIkwdcbS89/f/gF2DHiZp48uA6+fYxOBRVJt19s3uZ/2GtXz33ru54+N/xg9DOii75Sy5/Npfpj6xkag5xhPP7qUzsZ6p7oDOqjVM9nuI84x3VtGd3EeiY/qzXWanZ4lMPLcni2EOlojna1+cn8QsppZEhL3x56/DRTVsc4yo3mKmlyGiCNmQhgm4qb1Ew1luu+kv+cKHP6CeC9YxF7xZrr3hP1GdOILS1sm8ptEcI8syWvU6vd4skbHU63UG/T6RsSgXKPpD0m4fYy1OAlprjNJoL+iwpLZgwBIAdtwrr5Qtx5xM4WP6qWayF9gz3afVGQOf0cpm8Y/9K3d85Pd46pb5+yu1+jTZ8cZfl9MufSNdquRBI8oQguBdQZ4OsKpkVS1BFyl+0KNmY3wOk/tnGc4OaDeaFN4RlMZ7QZxgy0BVR4dda+Lohpx0zqmLSnHRl8Q3vO0dzOqYJGlT8SV798xw5Pp17P7eo6xvRtx7y6f5+m1/rfj998373YkzL5eLrv0l2uuOxCQRaZoiRiMCwXtEhFo1wbsCX5QYBbG1hDIw6GV0Z4cYH/ASkNigbYTFYIKjkVjccHjY9TZv3cypJ52yUK55Ti1qhL36F98ramwcHzfYu3+SPd97knWxRu3bSWM4xc1/8gcjWD8iVT1Str/i7XLhZW+iPb4W5wpmZmbI8xytNUopEI3REVZHuMLjyoBWFhFFf3bA7EyPoihQscbhEWIQQ/Alzg3A93n6ycMHdmqtmM7qhBPPPWrRomzRIiw+6jh5/41/zN7CUwQoBn0mKpbKYJrHvv4At9/8t0j/qXmw9JYz5BU/+wus23gcqRjy3KEiMMZgrUVbi3OO0gWstQTvQTTWGvDQ6/fn4JbYOAIEMRqNJThBicNKiStmefLxbx127eN3HI1KSk79qR0L5aZ5WrQIe+01byO3MQ7Dvl27qYSCNjm3/92f8Y9/+SH1XLDWnXelvPqa6xjbsI1CVymCxkQJ1WqVOB5leXle4lxAicYoS/CgtUUFxWCQ0u32yfMSLQqtLLl3CAoRBQ5iAmP1CF/O0uvuOez6x524FVMriZrC+Em1RYmyRQG2ase58tLzL2JYeGb27qUpjumnH+ePPvR+vvuV2+YvgWtOlLPf9uty3iVvwEdjFBKT5Tn1epU8z8myjDRNSdMU7z2RTYjjGKUM1saIKIbDjF63T1GUGGMxxuCcI6DQ1kBQWAQrHuNz9jzzBNL/QTbaOU5J5gZEdUWhUk4557SFddqcFmVJfPcNv0LuFN39M5jZaXq7d/G5j38UmZwfVc3jLpELX389lfGNzOSWSmxxLiMxgXw4TWxjlFIYE6G1xcYVlFKUpWc09aEo8pIsTSlzh8GgtUZ8wONRJkLEoKQk1qBczqC3n0e//fBhdrzswrMoQ0atWafWaTBhGgvlrsO04BG2dsfLZOOWo9jzzG6yqVme/Nr9/P3vvU89F6xjL3irXPgz/4HaxFF4PYanguiEOKrgXEYUa5wrKMsSP5cVOudI0xw39wxLh6PoKwuPPZiQBEEpRRxXQAxKBBVyKtYRSU7enyE98O3D7Dn73NNRVjHT75O5kkxyjn/D8Qu+LC44sCvfcjVBweTO3dx1y2e55xMfmQcqXrdDTr38ejn1vMsIyRiFJBRBQBmKwlF6N2o0+oBS5hCAEYyAYVRmSntDXOERD2bu/zXCaOTKQxC0aGqVKlZSlO+i/YAvfe7Th9lzxfWny96pXXjx1JpjYGOc8mw/butCue2QFhSYPnKrnHH2mTz80APcdds/8PRDD817TfvIc+T8S9/ICaddwN7pjCIovC/RUqBUCQS8GAqJyH2MqFHUiMioOuLBe8G7gHMOrfWhH6NAK4XWCi2CDp56rcLsgT1UbU6nJtx/751Aesges1nJEcdsYNPWDZTimDwwjfdCpZZgnqPo/OPWgl7x3PPP49ldT3PrZ/43ux68H+k/flh0bTz5NXLh5W+ls+4EJruBZns1ymcY6WKkSyQDUB6HJpUGmdQJEo1ABQghEELAez/3b/BzYwBaH0z9DbHVRFZjtDCY2ceWtW0iGXLfXZ9j3/ceRmTXIbsufOXxNNbWyVyKjhRxpULwUJYlNjFsPmvjgi6LCwvsJWfxsY9+hGf/5XYl7ocq7O3NcsL5b5Uzzr2MQrfpZpa40qHfS9FKMJRYyVGSgZSEuZkLT4ILihDCqC3iQUSh0Gg9ygRFBKMEozQKQYlHxAMBTUGnaXHDA+x8/Bs8+eAt6odhrXtpU856+el469gzsxvRQrVaQURG7RilOeHEhf3OjwXNEnd/9zGeuvuuwxuN0QY54eLL2XbsmRShRtB1fLBkaU4lqaJUjlAiBLwHLx7RHqUVSoHRBo0GFKAIMHqeiUKAJDKjJTP4uU20x2jQSkAFrPTZ/fQ3efjO+XXKq6/9GXzFoRNN1VQpQk4+2I/GUY0TNIb169cvjPPmtKDA/vIP508ynXr56wnxKlKqVJrjTM1mBAnU61VcKNFegTKIKEQrtDBKHHSB1prEWhBBwtxzLCjkh77WYRRlAQkepYUkijBG4cuCcpjy1FPf4OHP/Ok8u979X6+QztY2felilCKqROTDkjRLUUqo2AQbLFEU/eiv/li1qMXfEy58rWw68RWo6jqy3DMzOUml2sRGMcMiH0WKjjFEo6hg7jkUgTE5mIMJh0YYLY1ajSJLDmaNhEPNSGstkVXkecaunU+zZ+cj7PnnP58/FXz9ubL9vK0MdA9btfTTAYnRaAXoHCQgPkIxt01YQC1aaaq6cbtsO/EsypDQ75cEDLVaDR9KsmyIKAGt8EHwohFjsXFCFBviSBFHkESjJmMQNQdl5ECtNcYqjFVgRreotJAoj3Upg31P8tjXv8Te+/5xnl1XvfNcOfHsYylsn2AcPjiMMSRRheCFdJiPPhhaI+KJkp+ACFOrNstFV1xHLx/H2/hQ9CgPRgxKRptbowTvUqJGlUYjIU4sEPC+xCkBEYogdDodutMzo7KT1jQaDWa7XWxkEIQgjnqk0XmPyWce4a6bPvicYfHK68+Wcy47mR6z9PyQikmgKGhEVUKqGM44gk8wNgGjCIWj8PmC+m5RgK0/9mSCXYWOOoRQglIE7wk+oE1EnFTwIZDnKe2xBlHFEicaE42ywFGDEoIaLZF79+1jfNUqbFIQG8v+fQeoVav4vMAoz5qxKvuffYIH7rqNfQ/Nb/nHRyq56trLOe3lO9g92E1zIiGhQl4UJKaCFFAMS1yhUMQoHRMUeDUa815ILQqwY485GbRBFIdKRQFAazyC+AJtDJV6hUanBQa0FVAKCQGRubELEYzRozHrbIYQAnlpWTXeQZcKg8GWXZ742r3c+9mPIYNn5sHadFZLfvm9b6PWSXAmZe26cQ509yFaSGyCVhFpVjLo57hS0Gq0WfciGHjxP8NqW14ijcYaRFmKvAQ0IYBCE0UGUYG8zLCJZc3GtcTVGBsbRI8GcoLSiIoQbQhKE1cSvC9J05R6rYIRB2WffGY3UTHJ/Xfewr3/6y+eE9Zprz1e3v7ua5AopdbSmAR27nyaOI5pN9qkwwKXQZ56sjwgWLT5wWfcmIiF/pOUCx5hmzZtJ80MuppQFg7tNUppggi5KxGtqDWrNMeb1FpViqIYVS9ECKOQHCUSKqC0UPqCNB+yYd1G+lNTGJdTtZ6QPsXf/Mn/QGYfnQcqOkrJpVeey6uveRmRLag7w2y6n9RljE90EKWYnerRqneYmeyRZw4JowapGIt4Dzqg0egFnr1fcGAbNm4nzw3VZgVlhjgJWGPxwVMUJbWxFms2rqXaqDMsU5RWBKUQb0CPMkEAo/VoXQyBTqvNcOoADROoWs9dn7+Zx774CcWH/+O86x997lp532/dgNT6BNNjetil2WrQm5ql0Wpioohut0+t2mLQzciHHu8UxhiUtgiBoAIgo7PUC7wkLjiwRnOCvq9T+gBGo8XgvYCCWqPOqtVt6s0K3gSKssSaGNCjykYQmNsgI3O9rgJMKGhFnnTyaT7x8T8i7P7Oc3rxTe+5TN76S69n6PbRn55iYsMYNROzf3ov4xPjDNKSYphTr7WZPtClLMA7hVIalGa0pwsoHUCNNuNFmi2o/xYcmNIxka0zLHKYK8imaYqtWibWjNMab1NISVF44kpEOddC0aJHziIgwY16WBKoKc9YzfDNr36Vez7550i2ax6s489fJ1ddewVbdowTkj6m4umYFsPhkDxkNDpNusOU2FSoJFUmD3TxhVDkHmMStDKgBBcCgscoT1CChIIfGaz6sWvhgc0tISKCMZYggoks2hrG102QS44ooVKv0M8yjIlwzpHEVUrvSAyU3hEbsL6kqjPuu+1WHr7zc88J652//iq5/C0vR5o9FAOG4oiimIAhiMZGVUqvUCZmmHrSfkZRBJTXh5KKoIWizEiSiKIoSGJL6UsiU+PeL9+3oP5b+LReSlw5JG5UKBm1QjDQ7rRQVkFQBAElgtaKII5arcbMvgN0mg3IUmo6YJUQ0klu+uiN9PfvRLLDs8BNp9XkdVdfypqj21DJCZHHGHClMMhSRsusQSlLWQaKzFGmAVcAEqGMRc3tD41VqACiAtVahXw4oFaroTPNE/fMn0L+cWrBgQ36k/gIYl0lKz0hQJLEjK9ejTKjJJAgeA5uShU+L1jVahJ5h1aBqvH0pvbyxVs+Rffx+WfCTnnNNrn6+tdRHwMTOZyAdwHvR0ur0g6J/Gj2owhkaSBPHT4HTYRWFqX0qDwWKXKXY2JDZC1Zf0Cr0WY428f33UK7b+H3Ybt3PU6lEgg+J5QOZcBWYxqdJj6EUUXejhiMqvEJRgLaeeqRIQoZ+cxe/unzN/P0lz8zD9bF7zpbXnn1BTQ3JAzo0yuGOECCoUg93isqlRqRTSicp98ryIceKTVaxVgTY4xFlOBkZJ+oAHrUDDXGQqmp2ybf+Mo3Ftp9Cw9s587HqFUD3mUYY9DWEFciTKQp8YgKKGtAj6rtVhtMAOUd5bBPXTluvfkmnvnSp+fB+tn3XyRnXXAk1Gbo5tOoKMZLgkgVdDxKzZXgipJhv6A7nVFkDrxCa0tk4kORJVpQBrwOqHhkT1aWjDVXM5jOaUbjfOPWZxf8ZMuCA+tNPk2/vw+NJ4lilIKkluBCCYZDoEYj15oiy4mspZkkNKzmni9+gV0/MrtY3aLk+g+9Trbt2EJU9eTlAGOh9AUmjsiDowyeuFbB2pi0nzOcyaHQGIkwymKUHSUYYTR9pQzY2GAiRVakRElCtdKkOz1k3fhm7r/34ee5wx+vFhyYzO5Ujzz6MMGNushBHHElIncFSZKM+luMpnWt0ri8oFmpUaZD9j77DF/9zKfnvedrf+ESWhvGGOQlaU8Yq44TBU2kBG9SSjMkNyWpD2S54HJNVMZUqRKreNSOQR2arIIABIL2BBUQLYhSWBtTDD35IPBPf/OVRTk3tij9sGcf/VdM2UVlswRXEkUJLgTiSoLW9tAUrlbQbDbp9btUK5qbbvw9pDg8K7v2dy+T8S01auMxUUURRRF5frBnBeJL4jhCW8MgHdIbDPEBlLGjGqYyc27QoyJzJIgNOO0ofUGWDxnvdMj7GflsypEbj+LuO+5+7htbAC0KMDnwffX4V+9gIk5pWEtvJsVWqjg0eQrNuEVNK7TLRo1C7bnzi7cgkw8fBuviK4+QTZvbNBpCWu7D0cOZAV4VBEZTU7GpEPJA2htQZDne55QUlLZEYshLjzUJQSuChYEbkquMZruK9wURmkZUIyqgbRt0d0/y4K3fWrRTmYvWcZ7e/QSPP/wvFLMHGG9WCUXOcDikXm8yGKQUWUbFWlzaw4aCb372k4f9/pHHKHnVFZeAcqAcgicQRuMBqNEXokiEChGhNEipUQEwFmXN6LC7CHElIRDIyozcpbQ6DYyBPXt30Rkbo1Gp05/sUZEKDdvkox/+q0Xx10EtGrDe7NPqW996iLK7j2ce/TqrW1XccICOLFGlSlxtggidiuHBL92OzDx92Kf6vEvPxycxQcUQqqMfSUCqKKmBJCgq5IXGlQbvLBIqKKmhqaOlhgSDNoE0m6XeiLFGyIZ96rUa7Vobn3kkBXLDeHMtN//dZyh3yaKeeV7UA33lzHfVg1++naic5bGH7ueItatxxRATG9KixCqNKQY8+D8P/1SffNE62XHOyewbTOL1wQPkP+hLHXSpF6EoCkrnRpmfUig1ep1So2q7x4H1RLEiigxFlqMKaEQNwlBRM03qusVXvvQA3/2nha1qPJcW/chsue9BpVZtl5+59l0MDuwmboyRuSEEUBKYeuoxJDvcUS+9+Az2lweoTCQUbhalwqFRbQDRo7E4L4GiTEEbTAR+jqnMVf+tVXhf0G436PVmiKKY1WMT9KcHBKVY3VyDKWPu+fJ93P03X1t0WLAEDqUDyNRj6vOfvIlnHvkmCSmNRLG63aSC4oG77jzstfVtSsY3tyiinIEfEOYGQlHhBym4FlwocaEk4AnKjTJAM3rCgZ+LMMFJOWqGKk2sIqIQ0UrajFdXMZzMuO/Of1kysGAJRNhB+Z0PKjW2Ta7+wG+wesvRTM8eYGt7jIfv+MRhzjrhtNXoGkyMj7F7/y6qOgYZ3cZogNQQgsYFoXABdDyaBWE0u6gODs0ohSjBqpgsLWlV2yinyHueRtTkwM5Z7vvS/Xz79u8vGViwhIAByMzocMQl7/uQ/NSZF7Hrie8Ah5/aP+6k4wmqZHJqD0lkwcPBhUIx+soHRPBB47xgrD10qmVUQbGog0ujF+pJm+ACqozwmaeVjDG9u8ttf387ux6YXVKwYIksiT+qL3zsRm79xMdomPl/mG3T5qOJbJWajnDDIZHSo+eVHyUV3nviOMa5USX94NCn1aNzZAQhNqMqCmVAFRZTVoh8jcg3ePgr3+Gj7/tbtRRhAaiFnvr592jzCevk2l+7kswewMYlzXadqZke2iSjwq7RDNKU1liH/fv3j8bRCo+1ljiuoFGjQ+t5QWwj6tU26YyQ6CrPfP9ZPv3Jz1A8vrhp+7+lJbUk/luqNzpYX6NTW8sw20cvH1CNEopCCDhsHJGoiDXtcXoHZshLRy2pUhSOdGaAVorExFSiKhIC2cyQp759gDtuu4vhY4Xig4t9h/+2lhWwR776HTW2rSJHbl/LSads47gTt45aI2HU7JRSIa6k4tuYrIYuSopBoF7rMFaPkBDwZWD/s3u59+57ePQfppd0ND2XlhUwgJnHs8OcvPUl4zIxvob1GzdQbzUxkaUpjmbYzLpOGw08u3MX99x3H1++ef731y83Latn2IqWaJa4oufXCrBlphVgy0wrwJaZVoAtM60AW2ZaAbbMtAJsmWkF2DLTCrBlphVgy0wrwJaZVoAtM60AW2b6P1MrWThpjlmrAAAAAElFTkSuQmCC';
  let SUPABASE_URL = localStorage.getItem('z_url') || 'https://evxolmfwblxtmudksmnt.supabase.co';
  let SUPABASE_KEY = localStorage.getItem('z_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eG9sbWZ3Ymx4dG11ZGtzbW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzQxNTgsImV4cCI6MjA5MzMxMDE1OH0.v7uvLbz6NJoa4K0_KT9bKm5-M4mVAZ__77Tbqfef9fA';
  let CLIENTE_URL = localStorage.getItem('z_cliurl') || 'https://zello-zeta.vercel.app/cliente';

  // ===========================================================
  // AUTENTICAÇÃO (LOGIN ADMIN)
  // ===========================================================
  const SESSION_KEY = 'z_admin_session';
  const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;  // 7 dias
  let _adminLogado = null;  // Objeto do admin logado

  // Calcula SHA-256 hex de uma string (Web Crypto API)
  async function hashSenha(senha) {
    const enc = new TextEncoder().encode(senha);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Verifica se há sessão válida no localStorage
  function getSessao() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s.expires || Date.now() > s.expires) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return s;
    } catch (e) { return null; }
  }

  function setSessao(admin) {
    const s = {
      id: admin.id,
      email: admin.email,
      nome: admin.nome,
      expires: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    _adminLogado = s;
  }

  function limparSessao() {
    localStorage.removeItem(SESSION_KEY);
    _adminLogado = null;
  }

  // Verifica sessão ao carregar; mostra login se inválida
  async function verificarLogin() {
    const sess = getSessao();
    if (sess) {
      _adminLogado = sess;
      mostrarPainel();
      return true;
    }
    mostrarLogin();
    return false;
  }

  function mostrarLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    setTimeout(function(){
      const el = document.getElementById('login-email');
      if (el) el.focus();
    }, 100);
  }

  function mostrarPainel() {
    document.getElementById('login-screen').style.display = 'none';
    // Mostra info do usuário logado no rodapé do sidebar (se elemento existir)
    const elInfo = document.getElementById('admin-info');
    if (elInfo && _adminLogado) {
      elInfo.textContent = '👤 ' + (_adminLogado.nome || _adminLogado.email);
    }
    const elConta = document.getElementById('cfg-minha-conta');
    if (elConta && _adminLogado) {
      elConta.innerHTML = '<strong>' + (_adminLogado.nome || '—') + '</strong><br/>'
        + '<span style="font-family:monospace;">' + (_adminLogado.email || '—') + '</span>';
    }
  }

  // Submete o formulário de login
  async function doLogin(ev) {
    if (ev) ev.preventDefault();
    const email = (document.getElementById('login-email').value || '').trim().toLowerCase();
    const senha = document.getElementById('login-senha').value || '';
    const erroEl = document.getElementById('login-erro');
    const btn = document.getElementById('login-btn');

    if (!email || !senha) {
      erroEl.textContent = 'Preencha e-mail e senha.';
      erroEl.style.display = 'block';
      return false;
    }

    erroEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      const hash = await hashSenha(senha);
      // Busca admin pelo email
      const r = await fetch(SUPABASE_URL + '/rest/v1/admins?email=eq.' + encodeURIComponent(email) + '&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) throw new Error('Falha de comunicação. Verifique sua conexão.');
      const list = await r.json();
      const admin = list && list[0];

      if (!admin) {
        erroEl.textContent = 'E-mail ou senha inválidos.';
        erroEl.style.display = 'block';
        return false;
      }
      if (admin.ativo === false) {
        erroEl.textContent = 'Esta conta está desativada.';
        erroEl.style.display = 'block';
        return false;
      }
      if (admin.senha_hash !== hash) {
        erroEl.textContent = 'E-mail ou senha inválidos.';
        erroEl.style.display = 'block';
        return false;
      }

      // Sucesso! Atualiza ultimo_acesso (best-effort, não bloqueia)
      fetch(SUPABASE_URL + '/rest/v1/admins?id=eq.' + admin.id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ ultimo_acesso: new Date().toISOString() })
      }).catch(function(){});

      setSessao(admin);
      mostrarPainel();
      // Inicia o painel com tudo que precisa
      if (typeof carregarDados === 'function') carregarDados();
      if (typeof carregarTodasCidades === 'function') carregarTodasCidades();
      if (typeof carregarConfigEmpresa === 'function') setTimeout(carregarConfigEmpresa, 500);
      if (typeof inicializarDragDropMenu === 'function') setTimeout(inicializarDragDropMenu, 100);
      return false;
    } catch (e) {
      erroEl.textContent = 'Erro: ' + (e.message || 'tente novamente');
      erroEl.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
    return false;
  }

  // Logout: limpa sessão e mostra login de novo
  function doLogout() {
    if (!confirm('Sair da sua conta?')) return;
    limparSessao();
    location.reload();
  }

  // Trocar senha: usado em Configurações
  async function trocarSenha() {
    if (!_adminLogado) { alert('Você precisa estar logado.'); return; }
    const atual = prompt('Senha atual:');
    if (!atual) return;
    const nova = prompt('Nova senha (mínimo 8 caracteres):');
    if (!nova) return;
    if (nova.length < 8) { alert('A nova senha deve ter pelo menos 8 caracteres.'); return; }
    const conf = prompt('Confirme a nova senha:');
    if (conf !== nova) { alert('A confirmação não bate com a nova senha.'); return; }

    try {
      const hashAtual = await hashSenha(atual);
      // Busca admin pra confirmar senha atual
      const r = await fetch(SUPABASE_URL + '/rest/v1/admins?id=eq.' + _adminLogado.id + '&select=senha_hash', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      const list = await r.json();
      if (!list || !list[0] || list[0].senha_hash !== hashAtual) {
        alert('Senha atual incorreta.');
        return;
      }
      const hashNovo = await hashSenha(nova);
      const rUp = await fetch(SUPABASE_URL + '/rest/v1/admins?id=eq.' + _adminLogado.id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ senha_hash: hashNovo })
      });
      if (rUp.ok) alert('✅ Senha alterada com sucesso!');
      else alert('Erro ao alterar senha.');
    } catch (e) {
      alert('Erro: ' + (e.message || e));
    }
  }

  // Definir/resetar PIN de um cliente (chamado pelo admin)
  async function definirPinCliente(clienteId) {
    const c = clientes.find(function(x){ return x.id === clienteId; });
    if (!c) { alert('Cliente não encontrado.'); return; }
    const pin = prompt('Definir PIN de 6 dígitos para ' + (c.nome||'') + ':\n\n(O cliente usará este PIN para entrar no portal sem o link de leitura.)\n\nDigite só números, 6 dígitos:');
    if (!pin) return;
    if (!/^\d{6}$/.test(pin)) { alert('O PIN deve ter exatamente 6 dígitos numéricos.'); return; }
    try {
      const hash = await hashSenha(pin);
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + clienteId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ pin_hash: hash, portal_ativo: true })
      });
      if (r.ok) {
        alert('✅ PIN definido!\n\nInforme ao cliente:\n· CPF/CNPJ: ' + (c.cpf_cnpj||'?') + '\n· PIN: ' + pin + '\n\nEle pode acessar em: ' + (CLIENTE_URL.replace(/\/cliente$/, '')||'') );
        if (typeof carregarDados === 'function') await carregarDados();
      } else {
        alert('Erro ao salvar PIN.');
      }
    } catch (e) {
      alert('Erro: ' + (e.message || e));
    }
  }

  document.getElementById('cfg-url').value = SUPABASE_URL;
  document.getElementById('cfg-key').value = SUPABASE_KEY;
  document.getElementById('cfg-cli-url').value = CLIENTE_URL;

  function salvarCreds() {
    const url = document.getElementById('cfg-url').value.trim();
    const key = document.getElementById('cfg-key').value.trim();
    const cliUrl = document.getElementById('cfg-cli-url').value.trim();

    if (!url) { alert('⚠️ Informe a URL do Supabase.'); return; }
    if (!key) { alert('⚠️ Informe a Anon Key do Supabase.'); return; }
    if (!cliUrl) { alert('⚠️ Informe a URL do formulário do cliente.'); return; }

    // Validação básica de formato URL
    if (!/^https:\/\/.+\.supabase\.co\/?$/.test(url) && !/^https:\/\/.+/.test(url)) {
      if (!confirm('⚠️ URL do Supabase parece incomum.\nDeve começar com "https://" e geralmente termina em ".supabase.co".\n\nSalvar mesmo assim?')) return;
    }
    // Validação básica de URL do cliente
    if (!/^https?:\/\//.test(cliUrl)) {
      alert('⚠️ A URL do formulário do cliente deve começar com http:// ou https://');
      return;
    }
    // Validação Anon Key (JWT começa com "eyJ")
    if (!/^eyJ/.test(key)) {
      if (!confirm('⚠️ A Anon Key do Supabase normalmente começa com "eyJ".\n\nSalvar mesmo assim?')) return;
    }

    SUPABASE_URL = url.replace(/\/$/, '');  // remove barra final
    SUPABASE_KEY = key;
    CLIENTE_URL = cliUrl;
    localStorage.setItem('z_url', SUPABASE_URL);
    localStorage.setItem('z_key', SUPABASE_KEY);
    localStorage.setItem('z_cliurl', CLIENTE_URL);

    alert('✅ Credenciais salvas!\nO sistema vai testar a conexão agora.');
    testarConexaoConfig();
    carregarDados();
  }

  // =============================================
  // TESTE DE CONEXÃO
  // =============================================
  async function testarConexaoConfig() {
    const el = document.getElementById('cfg-status-conexao');
    const det = document.getElementById('cfg-status-detalhes');
    if (!el) return;

    el.style.background = '#FFF8E1';
    el.innerHTML = '<span style="font-size:18px;">⏳</span><span>Testando conexão com Supabase...</span>';
    det.innerHTML = '';

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      el.style.background = '#FFEBEE';
      el.innerHTML = '<span style="font-size:18px;">❌</span><span style="color:#C62828;font-weight:600;">Credenciais não configuradas</span>';
      det.innerHTML = 'Preencha a URL do Supabase e a Anon Key abaixo, e clique em "Salvar e conectar".';
      return;
    }

    try {
      const t0 = performance.now();
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?select=id&limit=1', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      const dt = Math.round(performance.now() - t0);

      if (r.ok) {
        el.style.background = '#E8F5E9';
        el.innerHTML = '<span style="font-size:18px;">✅</span><span style="color:#2E7D32;font-weight:600;">Conectado ao Supabase</span>';
        // Detalhes contagem
        let detalhes = 'Latência: ' + dt + 'ms · URL: ' + SUPABASE_URL + '<br/>';
        // Tentar contar registros
        try {
          const tabelas = ['clientes','propriedades','usos','leituras','contatos','notificacoes'];
          const counts = await Promise.all(tabelas.map(function(t){
            return fetch(SUPABASE_URL + '/rest/v1/' + t + '?select=id', {
              headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'count=exact' }
            }).then(function(rr){
              const cr = rr.headers.get('content-range');
              if (cr) {
                const m = cr.match(/\/(\d+)$/);
                return m ? parseInt(m[1],10) : 0;
              }
              return 0;
            }).catch(function(){ return '?'; });
          }));
          detalhes += 'Registros: ' + tabelas.map(function(t,i){ return t + ': <strong>' + counts[i] + '</strong>'; }).join(' · ');
        } catch(e) {}
        det.innerHTML = detalhes;
      } else if (r.status === 401 || r.status === 403) {
        el.style.background = '#FFEBEE';
        el.innerHTML = '<span style="font-size:18px;">🔒</span><span style="color:#C62828;font-weight:600;">Acesso negado (HTTP ' + r.status + ')</span>';
        det.innerHTML = 'A Anon Key parece inválida, ou as policies RLS não permitem acesso. Verifique a key e rode o SQL <code>zello_rls.sql</code>.';
      } else if (r.status === 404) {
        el.style.background = '#FFEBEE';
        el.innerHTML = '<span style="font-size:18px;">❌</span><span style="color:#C62828;font-weight:600;">Endpoint não encontrado (HTTP 404)</span>';
        det.innerHTML = 'A tabela <code>clientes</code> não existe no banco. Rode o SQL <code>zello_schema.sql</code> primeiro.';
      } else {
        el.style.background = '#FFEBEE';
        el.innerHTML = '<span style="font-size:18px;">❌</span><span style="color:#C62828;font-weight:600;">Erro HTTP ' + r.status + '</span>';
        det.innerHTML = 'Tente novamente ou verifique se a URL está correta.';
      }
    } catch(e) {
      el.style.background = '#FFEBEE';
      el.innerHTML = '<span style="font-size:18px;">📡</span><span style="color:#C62828;font-weight:600;">Falha de rede</span>';
      det.innerHTML = 'Não foi possível alcançar ' + SUPABASE_URL + '. Verifique sua conexão de internet e a URL.<br/>Erro: ' + (e.message || e);
    }
  }

  // =============================================
  // BACKUP / EXPORTAÇÃO COMPLETA
  // =============================================
  async function baixarBackupCompleto() {
    const status = document.getElementById('cfg-backup-status');
    if (!confirm('📦 Baixar backup completo de todos os dados?\n\nIsso vai consultar o Supabase. Pode levar alguns segundos se você tiver muitos registros.')) return;

    status.style.color = '#1565C0';
    status.innerHTML = '⏳ Baixando dados do Supabase...';

    try {
      const tabelas = ['clientes','propriedades','usos','contatos','leituras','notificacoes'];
      const backup = {
        _meta: {
          versao: '1.0',
          gerado_em: new Date().toISOString(),
          empresa: EMPRESA.nome || 'Zello Ambiental',
          supabase_url: SUPABASE_URL
        }
      };

      for (let i = 0; i < tabelas.length; i++) {
        const t = tabelas[i];
        status.innerHTML = '⏳ Baixando ' + t + ' (' + (i+1) + '/' + tabelas.length + ')...';
        const dados = await api(t + '?select=*') || [];
        backup[t] = dados;
      }

      const totalRegs = tabelas.reduce(function(s,t){ return s + (backup[t] || []).length; }, 0);

      // Gera arquivo
      const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const dt = new Date().toISOString().slice(0,16).replace(/[:T]/g,'-');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zello_backup_' + dt + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 100);

      status.style.color = '#2E7D32';
      status.innerHTML = '✅ Backup baixado: <strong>' + totalRegs + ' registros</strong> em ' + tabelas.length + ' tabelas. Guarde o arquivo em local seguro.';
    } catch(e) {
      status.style.color = '#C62828';
      status.innerHTML = '❌ Erro ao gerar backup: ' + (e.message || e);
      console.error('Backup error:', e);
    }
  }

  function restaurarBackup(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;
    const status = document.getElementById('cfg-backup-status');

    const reader = new FileReader();
    reader.onload = async function(ev) {
      let backup;
      try {
        backup = JSON.parse(ev.target.result);
      } catch(e) {
        status.style.color = '#C62828';
        status.innerHTML = '❌ Arquivo inválido: não é um JSON válido.';
        return;
      }

      if (!backup._meta || !backup.clientes) {
        status.style.color = '#C62828';
        status.innerHTML = '❌ Arquivo não parece ser um backup válido do Zello (faltam metadados).';
        return;
      }

      const tabelas = ['clientes','propriedades','usos','contatos','leituras','notificacoes'];
      const totais = tabelas.map(function(t){ return t + ': ' + (backup[t] || []).length; }).join('\n• ');

      // Dupla confirmação porque é destrutivo
      const c1 = confirm('⚠️ ATENÇÃO!\n\nVai RESTAURAR o backup feito em ' + new Date(backup._meta.gerado_em).toLocaleString('pt-BR') + '.\n\nConteúdo:\n• ' + totais + '\n\nIMPORTANTE: este backup será INSERIDO no banco. Se houver registros com mesmo ID, vai dar erro.\n\nRecomendação: faça um backup ANTES, caso queira voltar.\n\nProsseguir?');
      if (!c1) { evento.target.value = ''; return; }

      const c2 = prompt('Para confirmar, digite RESTAURAR (em maiúsculas):');
      if (c2 !== 'RESTAURAR') {
        status.innerHTML = 'Restauração cancelada.';
        evento.target.value = '';
        return;
      }

      status.style.color = '#1565C0';
      status.innerHTML = '⏳ Restaurando backup...';

      let totalInserido = 0, erros = [];
      // Ordem importante por causa das foreign keys
      for (let i = 0; i < tabelas.length; i++) {
        const t = tabelas[i];
        const regs = backup[t] || [];
        if (!regs.length) continue;
        status.innerHTML = '⏳ Restaurando ' + t + ' (' + regs.length + ' registros)...';
        try {
          // Insere em lotes de 100
          for (let j = 0; j < regs.length; j += 100) {
            const lote = regs.slice(j, j + 100);
            const r = await api(t, 'POST', lote, 'return=minimal');
            if (r && r.ok) totalInserido += lote.length;
            else {
              const txt = r ? await r.text() : 'sem resposta';
              erros.push(t + ': ' + txt.substring(0,100));
              break;
            }
          }
        } catch(e) {
          erros.push(t + ': ' + (e.message || e));
        }
      }

      if (erros.length) {
        status.style.color = '#C62828';
        status.innerHTML = '⚠️ Restauração com ' + erros.length + ' erro(s). Inseridos ' + totalInserido + ' registros.<br/>Erros: ' + erros.join('; ');
      } else {
        status.style.color = '#2E7D32';
        status.innerHTML = '✅ Backup restaurado! ' + totalInserido + ' registros inseridos.';
        await carregarDados();
      }
      evento.target.value = '';
    };
    reader.readAsText(arquivo);
  }

  function limparConfigsLocais() {
    if (!confirm('⚠️ Isso vai apagar TODAS as preferências salvas localmente:\n\n• Credenciais do Supabase\n• Dados do responsável técnico\n• Ordem do menu\n• URL do formulário do cliente\n\nOs DADOS DO BANCO não serão afetados, apenas as configurações deste navegador.\n\nProsseguir?')) return;

    const chaves = ['z_url','z_key','z_cliurl','z_eng_nome','z_eng_crea','z_eng_tel','z_eng_email','z_eng_empresa','z_menu_ordem','z_pend_concluidos'];
    chaves.forEach(function(k){ try { localStorage.removeItem(k); } catch(e) {} });

    alert('✅ Preferências locais limpas. A página vai recarregar.');
    location.reload();
  }

  const hdrs = function() { return { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json' }; };

  async function api(path, method, body, prefer) {
    try {
      method = method || 'GET';
      const opts = { method: method, headers: hdrs() };
      if (prefer) opts.headers['Prefer'] = prefer;
      if (body) opts.body = JSON.stringify(body);
      const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, opts);
      if (method === 'GET') return await r.json();
      return r;
    } catch(e) { console.error('API error:', e); return null; }
  }

  async function uploadFile(bucket, path, file) {
    try {
      // Tentar POST primeiro, se falhar (arquivo existe) tenta PUT (upsert)
      const headers = { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' };
      const r = await fetch(SUPABASE_URL + '/storage/v1/object/' + bucket + '/' + path, {
        method: 'POST', headers: headers, body: file
      });
      if (r.ok) return SUPABASE_URL + '/storage/v1/object/public/' + bucket + '/' + path;
      // Se falhou, tentar PUT
      const r2 = await fetch(SUPABASE_URL + '/storage/v1/object/' + bucket + '/' + path, {
        method: 'PUT', headers: headers, body: file
      });
      if (r2.ok) return SUPABASE_URL + '/storage/v1/object/public/' + bucket + '/' + path;
      const err = await r2.json().catch(function(){return {};});
      console.error('Upload falhou:', r2.status, err);
      return null;
    } catch(e) { console.error('Upload erro:', e); return null; }
  }

  let clientes = [], propriedades = [], usos = [], leituras = [], contatos = [], documentos = [];
  let cidadesCache = [];
  let clienteAtualId = null;
  let propAtualId = null;

  function getMes() { const n = new Date(); return n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0'); }

  // =============================================
  // MÁSCARAS E VALIDAÇÕES
  // =============================================
  function mascaraCpfCnpj(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 14);
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      v = v.replace(/(\d{2})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1/$2');
      v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    input.value = v;
  }

  function mascaraTel(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 10) v = '(' + v.substring(0,2) + ') ' + v.substring(2,7) + '-' + v.substring(7);
    else if (v.length > 6) v = '(' + v.substring(0,2) + ') ' + v.substring(2,6) + '-' + v.substring(6);
    else if (v.length > 2) v = '(' + v.substring(0,2) + ') ' + v.substring(2);
    else if (v.length > 0) v = '(' + v;
    input.value = v;
  }

  function formatarPortaria(input) {
    let v = input.value.replace(/[^0-9\/]/g, '');
    input.value = v;
  }

  function validarEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.toLowerCase()); }

  // Valida CPF pelos dígitos verificadores (true se válido).
  function validarCPF(cpf) {
    var c = (cpf||'').replace(/\D/g,'');
    if (c.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(c)) return false; // 11111111111, 22222222222 etc
    var s = 0;
    for (var i = 0; i < 9; i++) s += parseInt(c[i],10) * (10 - i);
    var d1 = 11 - (s % 11); if (d1 >= 10) d1 = 0;
    if (d1 !== parseInt(c[9],10)) return false;
    s = 0;
    for (var j = 0; j < 10; j++) s += parseInt(c[j],10) * (11 - j);
    var d2 = 11 - (s % 11); if (d2 >= 10) d2 = 0;
    return d2 === parseInt(c[10],10);
  }

  // Valida CNPJ pelos dígitos verificadores (true se válido).
  function validarCNPJ(cnpj) {
    var c = (cnpj||'').replace(/\D/g,'');
    if (c.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(c)) return false;
    var pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    var pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    var s = 0;
    for (var i = 0; i < 12; i++) s += parseInt(c[i],10) * pesos1[i];
    var d1 = s % 11; d1 = d1 < 2 ? 0 : 11 - d1;
    if (d1 !== parseInt(c[12],10)) return false;
    s = 0;
    for (var j = 0; j < 13; j++) s += parseInt(c[j],10) * pesos2[j];
    var d2 = s % 11; d2 = d2 < 2 ? 0 : 11 - d2;
    return d2 === parseInt(c[13],10);
  }

  // Atalho que valida automaticamente CPF ou CNPJ pelo tamanho
  function validarDocumento(doc) {
    var d = (doc||'').replace(/\D/g,'');
    if (d.length === 11) return validarCPF(d);
    if (d.length === 14) return validarCNPJ(d);
    return false;
  }

  function upper(s) { return s ? s.toUpperCase() : s; }

  // =============================================
  // CIDADES
  // =============================================
  async function carregarTodasCidades() {
    if (cidadesCache.length) return;
    // 1ª tentativa: SP + MG (foco principal do usuário) — endpoint mais rápido
    try {
      const r = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/SP,MG/municipios?orderBy=nome');
      if (r.ok) {
        const data = await r.json();
        cidadesCache = data.map(function(c) { return { nome: c.nome.toUpperCase(), estado: c.microrregiao.mesorregiao.UF.sigla }; });
        // 2ª tentativa em background: demais estados
        try {
          const r2 = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome');
          if (r2.ok) {
            const data2 = await r2.json();
            const jaTem = new Set(['SP','MG']);
            const resto = data2.filter(function(c){ return !jaTem.has(c.microrregiao.mesorregiao.UF.sigla); })
              .map(function(c){ return { nome: c.nome.toUpperCase(), estado: c.microrregiao.mesorregiao.UF.sigla }; });
            cidadesCache = cidadesCache.concat(resto);
            console.log('[Zello] Cidades carregadas:', cidadesCache.length);
          }
        } catch(e) { console.warn('[Zello] Falha ao carregar demais estados:', e); }
        return;
      }
    } catch(e) { console.warn('[Zello] Falha IBGE primária:', e); }
    // Fallback offline com lista mínima
    cidadesCache = [
      {nome:'ALTINÓPOLIS',estado:'SP'},{nome:'ARARAQUARA',estado:'SP'},{nome:'ARARAS',estado:'SP'},{nome:'BARRETOS',estado:'SP'},{nome:'BATATAIS',estado:'SP'},{nome:'BAURU',estado:'SP'},{nome:'BEBEDOURO',estado:'SP'},{nome:'BRODOWSKI',estado:'SP'},{nome:'CAMPINAS',estado:'SP'},{nome:'CASA BRANCA',estado:'SP'},{nome:'CRAVINHOS',estado:'SP'},{nome:'FRANCA',estado:'SP'},{nome:'GUARIBA',estado:'SP'},{nome:'GUARULHOS',estado:'SP'},{nome:'JABOTICABAL',estado:'SP'},{nome:'JARDINÓPOLIS',estado:'SP'},{nome:'LIMEIRA',estado:'SP'},{nome:'LUÍS ANTÔNIO',estado:'SP'},{nome:'MONTE ALTO',estado:'SP'},{nome:'ORLÂNDIA',estado:'SP'},{nome:'PIRACICABA',estado:'SP'},{nome:'PONTAL',estado:'SP'},{nome:'PRADÓPOLIS',estado:'SP'},{nome:'RIBEIRÃO PRETO',estado:'SP'},{nome:'SANTA RITA DO PASSA QUATRO',estado:'SP'},{nome:'SÃO CARLOS',estado:'SP'},{nome:'SÃO PAULO',estado:'SP'},{nome:'SÃO SIMÃO',estado:'SP'},{nome:'SERRANA',estado:'SP'},{nome:'SERRA AZUL',estado:'SP'},{nome:'SERTÃOZINHO',estado:'SP'},{nome:'TAQUARITINGA',estado:'SP'},{nome:'VIRADOURO',estado:'SP'},{nome:'BELO HORIZONTE',estado:'MG'},{nome:'UBERLÂNDIA',estado:'MG'},{nome:'UBERABA',estado:'MG'},{nome:'GOIÂNIA',estado:'GO'},{nome:'CURITIBA',estado:'PR'},{nome:'CAMPO GRANDE',estado:'MS'},{nome:'RIO DE JANEIRO',estado:'RJ'},{nome:'SALVADOR',estado:'BA'},{nome:'FORTALEZA',estado:'CE'},{nome:'MANAUS',estado:'AM'},{nome:'BELÉM',estado:'PA'},{nome:'RECIFE',estado:'PE'},{nome:'PORTO ALEGRE',estado:'RS'},{nome:'FLORIANÓPOLIS',estado:'SC'},{nome:'CUIABÁ',estado:'MT'},{nome:'PALMAS',estado:'TO'},{nome:'NATAL',estado:'RN'},{nome:'JOÃO PESSOA',estado:'PB'},{nome:'MACEIÓ',estado:'AL'},{nome:'ARACAJU',estado:'SE'},{nome:'TERESINA',estado:'PI'},{nome:'SÃO LUÍS',estado:'MA'},{nome:'MACAPÁ',estado:'AP'},{nome:'BOA VISTA',estado:'RR'},{nome:'RIO BRANCO',estado:'AC'},{nome:'PORTO VELHO',estado:'RO'}
    ];
    console.warn('[Zello] Usando lista de cidades fallback (sem IBGE).');
  }

  // Remove acentos para busca (ex: "araraquara" acha "Araraquara"; "sao jose" acha "São José")
  function _normTxt(s) {
    return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  }

  // Cache de buscas online por (UF, prefixo) para não bater na API repetidas vezes
  var _cacheBuscaOnline = {};
  var _buscaCidadeTimeout = null;

  // Busca cidades no cache local (resposta imediata)
  function _buscarCidadeLocal(q, ufFiltro) {
    var fonte = cidadesCache;
    if (ufFiltro) fonte = fonte.filter(function(c){ return c.estado === ufFiltro; });
    fonte.forEach(function(c){ if(!c._n) c._n = _normTxt(c.nome); });
    var comeca = fonte.filter(function(c){ return c._n.startsWith(q); });
    var contem = fonte.filter(function(c){ return !c._n.startsWith(q) && c._n.indexOf(q) !== -1; });
    return comeca.concat(contem).slice(0, 30);
  }

  // Busca cidades direto no IBGE pelo estado (fallback online — cobre cidades pequenas
  // que o cache local talvez ainda não tenha carregado)
  async function _buscarCidadeOnline(uf) {
    if (!uf) return [];
    if (_cacheBuscaOnline[uf]) return _cacheBuscaOnline[uf];
    try {
      var r = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+uf+'/municipios?orderBy=nome');
      if (!r.ok) return [];
      var data = await r.json();
      var lista = data.map(function(c){ return { nome: c.nome.toUpperCase(), estado: uf, _n: _normTxt(c.nome) }; });
      _cacheBuscaOnline[uf] = lista;
      // Adicionar ao cache global também (sem duplicar)
      var jaTem = {};
      cidadesCache.forEach(function(c){ jaTem[c.estado+'|'+c.nome] = true; });
      lista.forEach(function(c){ if (!jaTem[c.estado+'|'+c.nome]) cidadesCache.push(c); });
      console.log('[Zello] IBGE retornou '+lista.length+' cidades de '+uf);
      return lista;
    } catch(e) { console.warn('[Zello] Falha ao buscar cidades online:', e); return []; }
  }

  function _renderListaCidades(input, list, res, qDigitado) {
    if (!res.length) {
      var html = '<div style="padding:8px 12px;font-size:11px;color:var(--text-muted);">Nenhuma cidade encontrada na lista oficial.</div>';
      // Se houver texto digitado e UF, oferece usar mesmo assim
      if (qDigitado && qDigitado.length >= 2) {
        var ufSel = '';
        if (input.id === 'p-cidade') {
          var s = document.getElementById('p-estado');
          if (s) ufSel = s.value;
        }
        var nomeUpper = qDigitado.toUpperCase().replace(/'/g,"\\'");
        html += '<div class="autocomplete-item" style="background:#FEF3C7;color:#92400E;font-size:11px;font-weight:600;" onmousedown="selecionarCidade(\'' + input.id + '\',\'' + nomeUpper + '\',\'' + ufSel + '\')">✓ Usar "' + qDigitado.toUpperCase() + '" assim mesmo</div>';
      }
      list.innerHTML = html;
      list.style.display = 'block';
      return;
    }
    list.innerHTML = res.map(function(c) {
      return '<div class="autocomplete-item" onmousedown="selecionarCidade(\'' + input.id + '\',\'' + c.nome.replace(/'/g,"\\'") + '\',\'' + c.estado + '\')">' + c.nome + ' <span style="color:var(--text-muted);font-size:10px;">- ' + c.estado + '</span></div>';
    }).join('');
    list.style.display = 'block';
  }

  function buscarCidade(input) {
    var q = _normTxt(input.value).trim();
    var listId = input.id + '-list';
    var list = document.getElementById(listId);
    if (!list || q.length < 2) { if(list) list.style.display = 'none'; return; }

    // Estado selecionado (se houver) — usado para filtrar/buscar
    var ufFiltro = null;
    if (input.id === 'p-cidade') {
      var selUf = document.getElementById('p-estado');
      if (selUf) ufFiltro = selUf.value;
    }

    // 1. Resposta imediata: do cache local
    var resLocal = _buscarCidadeLocal(q, ufFiltro);
    _renderListaCidades(input, list, resLocal, input.value);

    // 2. Em paralelo: complementa com IBGE se há um UF e ainda não buscou online esse UF
    if (ufFiltro) {
      // Loga diagnóstico só na primeira busca — ajuda a debugar lista incompleta
      if (!_cacheBuscaOnline[ufFiltro]) {
        console.log('[Zello] Buscando cidades de ' + ufFiltro + ' no IBGE...');
      }
      if (_buscaCidadeTimeout) clearTimeout(_buscaCidadeTimeout);
      _buscaCidadeTimeout = setTimeout(function(){
        _buscarCidadeOnline(ufFiltro).then(function(lista){
          var qAtual = _normTxt(input.value).trim();
          if (qAtual.length < 2) return;
          // Re-renderiza com cache completo (ignora se usuário já apagou tudo)
          var res = _buscarCidadeLocal(qAtual, ufFiltro);
          _renderListaCidades(input, list, res, input.value);
        });
      }, 150);
    }
  }

  function selecionarCidade(inputId, valor, uf) {
    var el = document.getElementById(inputId);
    if(el) el.value = valor;
    // Se houver um <select> de estado associado (ex: 'p-estado' para 'p-cidade'), seleciona automaticamente
    if (uf && inputId === 'p-cidade') {
      var selUf = document.getElementById('p-estado');
      if (selUf) selUf.value = uf;
    }
    fecharSugestoes(inputId + '-list');
  }
  function fecharSugestoes(listId) { var el = document.getElementById(listId); if(el) el.style.display = 'none'; }
  // =============================================
  // ABRIR CADASTRO NOVO
  // =============================================
  function abrirCadastroCliente() {
    clienteAtualId = null;
    propAtualId = null;
    contatosExtras = [];
    limparFormCliente();
    document.getElementById('tit-cliente').textContent = 'Novo cliente';
    document.getElementById('eid-cliente').value = '';
    // Restaurar texto do botão azul (edição anterior pode tê-lo alterado)
    var _btnCli = document.querySelector('#ov-cliente .btn-blue');
    if (_btnCli) _btnCli.textContent = 'Salvar e continuar →';
    abrirModal('ov-cliente');
  }

  function limparFormCliente() {
    ['c-nome','c-doc','c-tel1','c-email'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.value = '';
    });
    limparResponsaveisLegais();
    var bl = document.getElementById('bloco-resp-legal'); if(bl) bl.style.display='none';
    document.getElementById('contatos-extras').innerHTML = '';
    contatosExtras = [];
  }

  // =============================================
  // CONTATOS EXTRAS
  // =============================================
  function adicionarContatoExtra() {
    var idx = contatosExtras.length;
    contatosExtras.push({});
    var el = document.getElementById('contatos-extras');
    var div = document.createElement('div');
    div.className = 'contato-extra';
    div.id = 'contato-extra-' + idx;
    div.style.cssText = 'background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;position:relative;';
    div.innerHTML =
      '<button onclick="removerContatoExtra('+idx+')" style="position:absolute;top:8px;right:8px;background:#fee2e2;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:11px;color:#C62828;">✕</button>' +
      '<div class="g2">' +
        '<div class="fg"><label class="fl">Nome</label><input class="fi upper" type="text" id="ce-nome-'+idx+'" placeholder="Nome do contato" /></div>' +
        '<div class="fg"><label class="fl">Papel</label><select class="fi" id="ce-papel-'+idx+'"><option value="conjuge">Cônjuge</option><option value="pai_mae">Pai/Mãe</option><option value="filho_filha">Filho/Filha</option><option value="irmao_irma">Irmão/Irmã</option><option value="gerente">Gerente</option><option value="advogado">Advogado</option><option value="contador">Contador</option><option value="outro">Outro</option></select></div>' +
        '<div class="fg"><label class="fl">Telefone</label><input class="fi" type="tel" id="ce-tel-'+idx+'" placeholder="(16) 99999-0000" maxlength="15" oninput="mascaraTel(this)" /></div>' +
        '<div class="fg"><label class="fl">E-mail</label><input class="fi" type="email" id="ce-email-'+idx+'" placeholder="email@dominio.com" /></div>' +
      '</div>';
    el.appendChild(div);
  }

  function removerContatoExtra(idx) {
    var el = document.getElementById('contato-extra-' + idx);
    if(el) el.remove();
  }

  function coletarContatosExtras() {
    var result = [];
    for(var i=0; i<contatosExtras.length; i++){
      var nome = (document.getElementById('ce-nome-'+i)||{value:''}).value.trim();
      if(!nome) continue;
      result.push({
        nome: nome.toUpperCase(),
        papel: (document.getElementById('ce-papel-'+i)||{value:'outro'}).value,
        telefone: (document.getElementById('ce-tel-'+i)||{value:''}).value.trim()||null,
        email: (document.getElementById('ce-email-'+i)||{value:''}).value.trim()||null
      });
    }
    return result;
  }

  // =============================================
  // RESPONSÁVEL LEGAL (CNPJ)
  // =============================================
  // (Versões duplicadas de detectarTipoCliente / adicionarResponsavelLegal /
  //  limparResponsaveisLegais foram removidas — as versões ativas estão no
  //  bloco "RESPONSÁVEL LEGAL" mais abaixo no arquivo.)

  function coletarResponsaveisLegais() {
    var lista = document.getElementById('lista-resp-legais');
    var result = [];
    for(var i=0; i<lista.children.length; i++){
      var nome = (document.getElementById('resp-legal-nome-'+i)||{value:''}).value.trim();
      if(!nome) continue;
      result.push({
        nome: nome.toUpperCase(),
        cpf: (document.getElementById('resp-legal-cpf-'+i)||{value:''}).value.trim(),
        telefone: (document.getElementById('resp-legal-tel-'+i)||{value:''}).value.trim()||null,
        email: (document.getElementById('resp-legal-email-'+i)||{value:''}).value.trim()||null,
        papel: 'responsavel_legal',
        principal: i === 0
      });
    }
    return result;
  }

  // =============================================
  // ETAPA 1: SALVAR CLIENTE
  // =============================================
  var _savingCliente = false;
  async function salvarClienteESair() {
    if (_savingCliente) return;
    _savingCliente = true;
    try {
      var ok = await _salvarClienteInterno();
      if(ok) { fecharModal('ov-cliente'); await carregarDados(); }
    } finally { _savingCliente = false; }
  }

  async function salvarCliente() {
    if (_savingCliente) return;
    _savingCliente = true;
    try {
      var eid = document.getElementById('eid-cliente').value;
      var ok = await _salvarClienteInterno();
      if(!ok) return;
      if(eid) {
        fecharModal('ov-cliente');
        await carregarDados();
        alert('Cliente atualizado com sucesso!');
      } else {
        fecharModal('ov-cliente');
        await carregarDados();
        _abrirEtapa2();
      }
    } finally { _savingCliente = false; }
  }

  async function _salvarClienteInterno() {
    var nome = document.getElementById('c-nome').value.trim();
    var doc = document.getElementById('c-doc').value.trim();
    var tel = document.getElementById('c-tel1').value.trim();
    var email = document.getElementById('c-email').value.trim();
    if(!nome) { alert('Nome é obrigatório.'); return false; }
    if(!doc) { alert('CPF/CNPJ é obrigatório.'); return false; }
    var isCNPJ = doc.replace(/\D/g,'').length > 11;

    // Validação de dígitos verificadores
    if (!validarDocumento(doc)) {
      alert('⚠️ ' + (isCNPJ?'CNPJ':'CPF') + ' inválido. Confira os dígitos.');
      return false;
    }

    // Validação de email se preenchido
    if (email && !validarEmail(email)) {
      alert('⚠️ E-mail inválido. Confira o formato.');
      return false;
    }

    // Validação de telefone (mínimo 10 dígitos = DDD + 8 ou 9)
    var telDig = (tel||'').replace(/\D/g,'');
    if (tel && telDig.length < 10) {
      alert('⚠️ Telefone incompleto. Use formato (XX) 9XXXX-XXXX.');
      return false;
    }

    var respLegais = coletarResponsaveisLegais();
    if(isCNPJ && respLegais.length === 0) {
      alert('Para empresas, informe ao menos um responsável legal.'); return false;
    }

    // Validar CPF de cada responsável legal
    for (var rli = 0; rli < respLegais.length; rli++) {
      var rl = respLegais[rli];
      if (!rl.cpf || rl.cpf.replace(/\D/g,'').length === 0) {
        alert('⚠️ Responsável legal "' + rl.nome + '" — CPF é obrigatório.');
        return false;
      }
      if (!validarCPF(rl.cpf)) {
        alert('⚠️ CPF do responsável legal "' + rl.nome + '" é inválido.');
        return false;
      }
    }

    var eid = document.getElementById('eid-cliente').value;

    // Validação de CPF/CNPJ duplicado — comparação só por dígitos
    var docDigitos = doc.replace(/\D/g,'');
    var duplicado = clientes.find(function(cc){
      var cdig = (cc.cpf_cnpj||'').replace(/\D/g,'');
      // Em edição, ignorar o próprio cliente
      if (eid && cc.id === eid) return false;
      return cdig && cdig === docDigitos;
    });
    if (duplicado) {
      alert('⚠️ Já existe um cliente cadastrado com este ' + (isCNPJ?'CNPJ':'CPF') + ':\n\n' +
            '• ' + duplicado.nome + '\n' +
            '• Documento: ' + (duplicado.cpf_cnpj||'') + '\n\n' +
            'Não é possível cadastrar o mesmo titular duas vezes. ' +
            'Se desejar adicionar uma nova propriedade ou ponto a este cliente, ' +
            'use o botão "Ver" na lista de clientes.');
      return false;
    }

    var payload = { nome: upper(nome), cpf_cnpj: doc, telefone1: tel||null, email: email||null, ativo: true };
    var cid;
    if(eid) {
      await api('clientes?id=eq.'+eid, 'PATCH', payload, 'return=minimal');
      cid = eid;
    } else {
      var r = await api('clientes', 'POST', payload, 'return=representation');
      console.log('[Zello] POST clientes status:', r ? r.status : 'null');
      if(!r || !r.ok) {
        var errText = r ? await r.text() : 'sem resposta';
        console.error('[Zello] Erro clientes:', errText);
        alert('Erro ao salvar cliente: ' + errText.substring(0,200)); return false;
      }
      var d = await r.json(); cid = d[0] && d[0].id;
      console.log('[Zello] Cliente salvo, id:', cid);
      if(!cid) { alert('Erro ao obter ID do cliente.'); return false; }
    }
    clienteAtualId = cid;

    // Sempre limpa todos os contatos do cliente antes de re-inserir, em qualquer modo
    // (novo cadastro ou edição). Isso impede duplicatas se o usuário clica salvar duas
    // vezes ou se o fluxo de edição não tiver feito o DELETE corretamente.
    await api('contatos?cliente_id=eq.'+cid, 'DELETE', null, 'return=minimal');

    // Deduplica responsáveis legais por (nome+cpf) e contatos extras por (nome+telefone)
    // antes de gravar — mesmo se o usuário tiver adicionado o mesmo duas vezes na tela.
    var rlVistos = {};
    var rlDedup = [];
    for (var i=0; i<respLegais.length; i++) {
      var rl = respLegais[i];
      var k = (rl.nome||'').trim().toUpperCase() + '|' + (rl.cpf||'').replace(/\D/g,'');
      if (rlVistos[k]) continue;
      rlVistos[k] = true;
      rlDedup.push(rl);
    }
    for (var i2=0; i2<rlDedup.length; i2++) {
      var rl2 = rlDedup[i2];
      await api('contatos', 'POST', { cliente_id: cid, nome: rl2.nome, papel: rl2.papel, telefone: rl2.telefone, email: rl2.email, principal: rl2.principal }, 'return=minimal');
    }

    var extras = coletarContatosExtras();
    var ctVistos = {};
    var ctDedup = [];
    for (var j=0; j<extras.length; j++) {
      var ct = extras[j];
      var k2 = (ct.nome||'').trim().toUpperCase() + '|' + ((ct.telefone||'').replace(/\D/g,'')) + '|' + (ct.papel||'');
      if (ctVistos[k2]) continue;
      ctVistos[k2] = true;
      ctDedup.push(ct);
    }
    for (var j2=0; j2<ctDedup.length; j2++) {
      var ct2 = ctDedup[j2];
      await api('contatos', 'POST', { cliente_id: cid, nome: ct2.nome, papel: ct2.papel, telefone: ct2.telefone, email: ct2.email, principal: false }, 'return=minimal');
    }
    return true;
  }

  // =============================================
  // ETAPA 2: PROPRIEDADE
  // =============================================
  function _abrirEtapa2() {
    document.getElementById('eid-prop').value = '';
    document.getElementById('p-nome').value = '';
    document.getElementById('p-cidade').value = '';
    document.getElementById('p-estado').value = 'SP';
    document.querySelector('#ov-prop .modal-title').textContent = 'Cadastrar propriedade / empreendimento';
    var sub = document.getElementById('prop-sub');
    var cli = clientes.find(function(c){ return c.id === clienteAtualId; });
    if(sub) sub.textContent = 'Etapa 2 de 3' + (cli ? ' — ' + cli.nome : '');
    // Restaurar texto do botão azul (edição anterior pode tê-lo alterado)
    var _btnProp = document.querySelector('#ov-prop .btn-blue');
    if (_btnProp) _btnProp.textContent = 'Salvar e continuar →';
    // Pré-carrega cidades de SP em background (estado padrão)
    _buscarCidadeOnline('SP');
    abrirModal('ov-prop');
  }

  async function salvarPropESair() {
    var ok = await _salvarPropInterno();
    if(ok) { fecharModal('ov-prop'); await carregarDados(); }
  }

  async function adicionarOutraPropriedade() {
    var ok = await _salvarPropInterno();
    if(!ok) return;
    fecharModal('ov-prop');
    setTimeout(function(){ _abrirEtapa2(); }, 150);
  }

  async function salvarPropriedade() {
    var eid = document.getElementById('eid-prop').value;
    var ok = await _salvarPropInterno();
    if(!ok) return;
    if(eid) {
      document.querySelector('#ov-prop .modal-title').textContent = 'Cadastrar propriedade / empreendimento';
      fecharModal('ov-prop');
      await carregarDados();
      verCliente(clienteAtualId);
      alert('Propriedade atualizada com sucesso!');
    } else {
      fecharModal('ov-prop');
      await carregarDados();  // Atualiza contatos para popularSelectResponsavel
      setTimeout(function(){ _abrirEtapa3(); }, 150);
    }
  }

  async function _salvarPropInterno() {
    var nome = document.getElementById('p-nome').value.trim();
    if(!nome) { alert('Nome do empreendimento é obrigatório.'); return false; }
    if(!clienteAtualId) { alert('Erro: reinicie o cadastro.'); return false; }
    var payload = {
      cliente_id: clienteAtualId,
      nome: upper(nome),
      cidade: upper(document.getElementById('p-cidade').value.trim()) || null,
      estado: document.getElementById('p-estado').value,
      ativo: true
    };
    var eid = document.getElementById('eid-prop').value;
    if(eid) {
      await api('propriedades?id=eq.'+eid, 'PATCH', payload, 'return=minimal');
      propAtualId = eid;
    } else {
      var r = await api('propriedades', 'POST', payload, 'return=representation');
      console.log('[Zello] POST propriedades status:', r ? r.status : 'null');
      if(!r || !r.ok) {
        var errText = r ? await r.text() : 'sem resposta';
        console.error('[Zello] Erro propriedades:', errText);
        alert('Erro ao salvar propriedade: ' + errText.substring(0,200)); return false;
      }
      var d = await r.json(); propAtualId = d[0] && d[0].id;
      console.log('[Zello] Propriedade salva, id:', propAtualId);
      if(!propAtualId) { alert('Erro ao obter ID da propriedade.'); return false; }
    }
    return true;
  }

  // =============================================
  // ETAPA 3: PONTO DE CAPTAÇÃO
  // =============================================
  function _abrirEtapa3() {
    limparFormUso();
    var listaEl = document.getElementById('lista-usos-adicionados');
    if(listaEl) listaEl.innerHTML = '';
    popularSelectResponsavel(clienteAtualId, null);
    document.querySelector('#ov-uso .modal-title').textContent = 'Cadastrar ponto de captação';
    var sub = document.getElementById('uso-sub');
    var prop = propriedades.find(function(p){ return p.id === propAtualId; });
    if(sub) sub.textContent = 'Etapa 3 de 3' + (prop ? ' — ' + prop.nome : '');
    // Restaurar texto e ação do botão de salvar (edição anterior pode tê-los alterado)
    var _btnUso = document.getElementById('btn-salvar-uso');
    if (_btnUso) {
      _btnUso.textContent = 'Salvar e finalizar ✓';
      _btnUso.onclick = function() { salvarUso(true); };
    }
    // Mostrar de volta o botão "+ Adicionar outro ponto"
    var _btnAddOutro = document.getElementById('btn-uso-add-outro');
    if (_btnAddOutro) _btnAddOutro.style.display = '';
    abrirModal('ov-uso');
  }



  function cancelarUso() {
    fecharModal('ov-uso');
  }

  function toggleHidroInput(semHidro) {
    var bloco = document.getElementById('u-hidro-block');
    if(bloco) bloco.style.display = semHidro ? 'none' : 'block';
  }

  // Calcula volume mensal autorizado (m³/mês) a partir de m³/h × horas/dia × dias/mês
  function calcVazao() {
    var vh = parseFloat((document.getElementById('u-vh')||{}).value) || 0;
    var hd = parseFloat((document.getElementById('u-hd')||{}).value) || 0;
    var dm = parseFloat((document.getElementById('u-dm')||{}).value) || 0;
    var vol = vh * hd * dm;
    var elVc = document.getElementById('u-vc');
    var elVr = document.getElementById('u-vr');
    if (elVc) elVc.textContent = vol.toLocaleString('pt-BR', {maximumFractionDigits: 1});
    if (elVr) elVr.style.display = vol > 0 ? 'block' : 'none';
  }

  // Limita o ano de um input type=date a 4 dígitos (1900-2099). Trunca anos absurdos.
  function validarAno4Digitos(input) {
    var v = input.value || '';
    if (!v) return;
    // formato esperado: YYYY-MM-DD
    var partes = v.split('-');
    if (partes.length !== 3) return;
    // Trunca anos com mais de 4 dígitos (ex: 20245)
    if (partes[0].length > 4) {
      partes[0] = partes[0].slice(0, 4);
      input.value = partes.join('-');
    }
    // Só valida quando o ano está completo (4 dígitos) — não interfere durante a digitação
    if (partes[0].length === 4) {
      var ano = parseInt(partes[0], 10);
      if (ano > 2099 || ano < 1900) {
        alert('Ano deve estar entre 1900 e 2099. Verifique a data.');
        input.value = '';
      }
    }
  }

  function limparFormUso() {
    ['u-desc','u-req','u-portaria','u-processo','u-data-emissao','u-prazo','u-vh','u-hd','u-dm','u-serie'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.value = '';
    });
    var tipo = document.getElementById('u-tipo'); if(tipo) tipo.value = 'outorga';
    var hidro = document.getElementById('u-sem-hidro'); if(hidro) hidro.checked = false;
    var resp = document.getElementById('u-responsavel'); if(resp) resp.value = '';
    var foto = document.getElementById('u-foto'); if(foto) foto.value = '';
    var pdf = document.getElementById('u-pdf-outorga'); if(pdf) pdf.value = '';
    var pdfAtual = document.getElementById('u-pdf-atual'); if(pdfAtual) { pdfAtual.style.display='none'; pdfAtual.innerHTML=''; }
    var fotoAtual = document.getElementById('u-foto-atual'); if(fotoAtual) { fotoAtual.style.display='none'; fotoAtual.innerHTML=''; }
    var vc = document.getElementById('u-vc'); if(vc) vc.textContent = '0';
    var vr = document.getElementById('u-vr'); if(vr) vr.style.display='none';
    document.getElementById('eid-uso').value = '';
    toggleHidroInput(false);
  }

  // (Versão duplicada de popularSelectResponsavel removida — a versão ativa
  //  está mais abaixo, com deduplicação por telefone+nome.)

  // Flag global de "salvamento em andamento" — bloqueia duplo clique
  var _salvandoUso = false;

  async function salvarUso(finalizar) {
    // Proteção contra duplo clique: se já está salvando, ignora
    if (_salvandoUso) return;
    _salvandoUso = true;

    // Desabilita visualmente os dois botões enquanto salva
    var _btnSalvar = document.getElementById('btn-salvar-uso');
    var _btnAddOutro = document.getElementById('btn-uso-add-outro');
    var _txtOriginal = _btnSalvar ? _btnSalvar.textContent : '';
    if (_btnSalvar) { _btnSalvar.disabled = true; _btnSalvar.textContent = '⏳ Salvando...'; }
    if (_btnAddOutro) _btnAddOutro.disabled = true;

    // Helper interno pra reabilitar tudo no fim (em qualquer caminho de saída)
    function _reabilitarBotoes() {
      _salvandoUso = false;
      if (_btnSalvar) { _btnSalvar.disabled = false; _btnSalvar.textContent = _txtOriginal || 'Salvar e finalizar ✓'; }
      if (_btnAddOutro) _btnAddOutro.disabled = false;
    }

    try {
    if(!clienteAtualId || !propAtualId) {
      alert('Erro interno: dados do cliente perdidos. Feche e refaça o cadastro.');
      return;
    }
    var desc = document.getElementById('u-desc').value.trim();
    if(!desc) { alert('Descrição do ponto é obrigatória.'); return; }
    var semHidro = document.getElementById('u-sem-hidro').checked;
    var respSel = document.getElementById('u-responsavel').value;
    var respTel = respSel === 'outro' ? (document.getElementById('u-resp-fone')||{value:''}).value.trim() : respSel;

    // Upload foto
    var fotoUrl = null;
    var fotoInput = document.getElementById('u-foto');
    if(fotoInput && fotoInput.files && fotoInput.files[0]) {
      var fotoExt = fotoInput.files[0].name.split('.').pop() || 'jpg';
      fotoUrl = await uploadFile('documentos-zello','fotos/'+clienteAtualId+'/'+Date.now()+'.'+fotoExt, fotoInput.files[0]);
    }

    // Upload PDF
    var pdfUrl = null;
    var pdfInput = document.getElementById('u-pdf-outorga');
    if(pdfInput && pdfInput.files && pdfInput.files[0]) {
      pdfUrl = await uploadFile('documentos-zello','outorgas/'+clienteAtualId+'/'+Date.now()+'.pdf', pdfInput.files[0]);
    }

    var eid = document.getElementById('eid-uso').value;
    var payload = {
      propriedade_id: propAtualId,
      cliente_id: clienteAtualId,
      descricao: upper(desc),
      tipo_outorga: document.getElementById('u-tipo').value,
      requerimento: upper(document.getElementById('u-req').value.trim())||null,
      portaria: document.getElementById('u-portaria').value.trim()||null,
      processo: document.getElementById('u-processo').value.trim()||null,
      data_emissao: document.getElementById('u-data-emissao').value||null,
      prazo_anos: parseInt(document.getElementById('u-prazo').value)||null,
      vazao_m3h: parseFloat(document.getElementById('u-vh').value)||null,
      horas_uso_dia: parseFloat(document.getElementById('u-hd').value)||null,
      dias_uso_mes: parseInt(document.getElementById('u-dm').value)||null,
      possui_hidrometro: !semHidro,
      numero_serie: semHidro ? null : (upper(document.getElementById('u-serie').value.trim())||null),
      responsavel_tel: respTel||null,
      ativo: true
    };
    if(fotoUrl) payload.foto_equipamento_url = fotoUrl;
    if(pdfUrl) payload.outorga_pdf_url = pdfUrl;

    if(eid) {
      await api('usos?id=eq.'+eid, 'PATCH', payload, 'return=minimal');
    } else {
      payload.token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16);});
      var r = await api('usos', 'POST', payload, 'return=minimal');
      if(!r || !r.ok) {
        var errTxt = r ? await r.text() : 'sem resposta';
        console.error('[Zello] Erro usos POST:', errTxt);
        // Se erro indicar coluna inexistente, remove a coluna do payload e tenta de novo
        // Mensagem típica do PostgREST: "Could not find the 'xxx' column of 'usos' in the schema cache"
        var matchCol = errTxt.match(/'([a-z_]+)' column of/i) ||
                       errTxt.match(/column "([a-z_]+)"/i) ||
                       errTxt.match(/column ([a-z_]+) does not exist/i);
        if (matchCol && matchCol[1] && payload.hasOwnProperty(matchCol[1])) {
          console.warn('[Zello] Coluna inexistente, removendo:', matchCol[1]);
          var colRemovida = matchCol[1];
          delete payload[colRemovida];
          r = await api('usos', 'POST', payload, 'return=minimal');
          if(!r || !r.ok) { alert('Erro ao salvar ponto de captação. ' + (r ? await r.text() : '')); return; }
          // Avisa o usuário sobre colunas críticas que precisam ser criadas no banco
          if (colRemovida === 'outorga_pdf_url' || colRemovida === 'foto_equipamento_url') {
            alert('⚠️ Atenção: o ponto foi salvo, MAS o ' +
                  (colRemovida === 'outorga_pdf_url' ? 'PDF da outorga' : 'foto do equipamento') +
                  ' NÃO foi gravado porque a coluna "' + colRemovida + '" não existe na tabela "usos" do banco.\n\n' +
                  'Para corrigir, execute no Supabase (SQL Editor):\n\n' +
                  'ALTER TABLE usos ADD COLUMN ' + colRemovida + ' TEXT;');
          }
        } else if(errTxt.indexOf('portaria') > -1 || errTxt.indexOf('processo') > -1 || errTxt.indexOf('data_emissao') > -1 || errTxt.indexOf('prazo_anos') > -1 || errTxt.indexOf('tipo_outorga') > -1 || errTxt.indexOf('requerimento') > -1) {
          // Identifica quais colunas faltam para avisar com clareza
          var colsFaltando = [];
          ['portaria','processo','data_emissao','prazo_anos','tipo_outorga','requerimento'].forEach(function(col){
            if (errTxt.indexOf(col) > -1 && payload.hasOwnProperty(col)) {
              colsFaltando.push(col);
              delete payload[col];
            }
          });
          r = await api('usos', 'POST', payload, 'return=minimal');
          if(!r || !r.ok) { alert('Erro ao salvar ponto de captação. ' + (r ? await r.text() : '')); return; }
          // Avisa o usuário que os dados de outorga não foram gravados
          if (colsFaltando.length > 0) {
            var faltandoLabel = colsFaltando.map(function(c){
              var nomes = {'portaria':'Portaria','processo':'Processo SEI','data_emissao':'Data de emissão','prazo_anos':'Prazo (anos)','tipo_outorga':'Tipo de outorga','requerimento':'Requerimento'};
              return nomes[c]||c;
            }).join(', ');
            var sqlFix = colsFaltando.map(function(c){
              var tipos = {'portaria':'TEXT','processo':'TEXT','data_emissao':'DATE','prazo_anos':'INTEGER','tipo_outorga':'TEXT','requerimento':'TEXT'};
              return 'ALTER TABLE usos ADD COLUMN IF NOT EXISTS ' + c + ' ' + (tipos[c]||'TEXT') + ';';
            }).join('\n');
            alert('⚠️ Atenção: o ponto foi salvo, MAS os campos abaixo NÃO foram gravados porque as colunas não existem no banco:\n\n' +
                  '• ' + faltandoLabel + '\n\n' +
                  'Sem isso, a tela "Renovações" não consegue calcular vencimentos.\n\n' +
                  'Execute no Supabase (SQL Editor):\n\n' + sqlFix);
          }
        } else {
          alert('Erro ao salvar ponto de captação: ' + errTxt.substring(0,200)); return;
        }
      }
    }

    if(finalizar) {
      fecharModal('ov-uso');
      await carregarDados();
      verCliente(clienteAtualId);
    } else {
      limparFormUso();
      popularSelectResponsavel(clienteAtualId, null);
    }
    } catch(_e) {
      console.error('[Zello] Erro inesperado em salvarUso:', _e);
      alert('Erro inesperado ao salvar: ' + (_e && _e.message ? _e.message : _e));
    } finally {
      // Garante que os botões voltam ao normal em QUALQUER caminho de saída
      _reabilitarBotoes();
    }
  }

  // (Versões obsoletas de editarCliente / editarPropriedade / editarUso / verCliente
  //  foram removidas — as versões ativas estão mais abaixo.)

  // =============================================
  // RENDERIZAR LISTA DE CLIENTES
  // =============================================
  // (Versões duplicadas de renderClientes, filtrarClientes e limparTodosClientes
  //  foram removidas — as versões ativas estão mais abaixo.)


  // =============================================
  // CARREGAR E RENDERIZAR DADOS
  // =============================================
  // =============================================
  // ACOMPANHAMENTO DE VAZÕES
  // =============================================
  function popularAnoSelect() {
    const s = document.getElementById('acomp-ano');
    if (!s) return;
    const anoAtual = new Date().getFullYear();
    s.innerHTML = '';
    for (let a = anoAtual; a >= anoAtual - 3; a--) {
      const o = document.createElement('option');
      o.value = a; o.textContent = a;
      if (a === anoAtual) o.selected = true;
      s.appendChild(o);
    }
  }

  function popularAcompClientes() {
    const s = document.getElementById('acomp-cli');
    if (!s) return;
    const v = s.value;
    s.innerHTML = '<option value="">Todos os clientes</option>';
    clientes.forEach(function(c) {
      const o = document.createElement('option');
      o.value = c.id; o.textContent = c.nome;
      s.appendChild(o);
    });
    s.value = v;
  }

  async function carregarAcompanhamento() {
    const el = document.getElementById('acomp-conteudo');
    if (!el) return;
    el.innerHTML = '<p style="font-size:12px;color:var(--text-muted)">Carregando dados...</p>';

    const cid = document.getElementById('acomp-cli').value;
    const ano = document.getElementById('acomp-ano').value || new Date().getFullYear();
    const meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    const nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

    // Filtrar usos relevantes
    let usosVisiveis = usos.filter(function(u) { return u.possui_hidrometro; });
    if (cid) usosVisiveis = usosVisiveis.filter(function(u) { return u.cliente_id === cid; });

    if (!usosVisiveis.length) {
      el.innerHTML = '<div class="card" style="text-align:center;padding:32px;color:var(--text-muted)">Nenhum ponto com hidrômetro encontrado.</div>';
      return;
    }

    // Buscar leituras do ano para todos os pontos
    const url = 'leituras?select=*&uso_id=in.(' + usosVisiveis.map(function(u){return u.id;}).join(',') + ')&mes_referencia=gte.' + ano + '-01&mes_referencia=lte.' + ano + '-12';
    const leiturasAno = await api(url) || [];

    // Agrupar por uso_id e mes
    const dadosPorUso = {};
    leiturasAno.forEach(function(l) {
      if (!dadosPorUso[l.uso_id]) dadosPorUso[l.uso_id] = {};
      dadosPorUso[l.uso_id][l.mes_referencia] = l.consumo_m3 || 0;
    });

    el.innerHTML = usosVisiveis.map(function(u) {
      const c = clientes.find(function(cc){return cc.id===u.cliente_id;});
      const p = propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      const aut = getAutorizadoUso(u);
      const dadosUso = dadosPorUso[u.id] || {};
      const valores = meses.map(function(m) { return dadosUso[ano + '-' + m] || 0; });
      const totalAno = valores.reduce(function(s,v){return s+v;},0);
      const pctAno = aut > 0 ? Math.round(totalAno/(aut*12)*100) : 0;
      const maxVal = Math.max.apply(null, valores.concat([aut, 1]));
      const mesAtual = new Date().getMonth(); // 0-indexed

      // Gerar barras
      const barras = valores.map(function(v, i) {
        const acima = aut > 0 && v > aut;
        const vazio = v === 0;
        const pct = Math.round(v / maxVal * 100);
        const isMesAtual = i === mesAtual && parseInt(ano) === new Date().getFullYear();
        const corBarra = vazio ? '#e5e7eb' : acima ? '#C62828' : '#1565C0';
        const corTexto = acima ? '#C62828' : vazio ? '#9ca3af' : '#374151';
        return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">' +
          '<div style="font-size:10px;font-weight:' + (acima?'700':'400') + ';color:' + corTexto + ';height:16px;display:flex;align-items:flex-end;">' + (vazio ? '' : v.toFixed(0)) + '</div>' +
          '<div style="width:100%;height:80px;display:flex;align-items:flex-end;position:relative;">' +
            (aut > 0 ? '<div style="position:absolute;bottom:' + Math.round(aut/maxVal*80) + 'px;left:0;right:0;height:1px;background:#E65100;opacity:0.5;"></div>' : '') +
            '<div style="width:100%;height:' + Math.max(pct*80/100, vazio?0:3) + 'px;background:' + corBarra + ';border-radius:3px 3px 0 0;transition:height .3s;"></div>' +
          '</div>' +
          '<div style="font-size:10px;color:' + (isMesAtual?'var(--blue)':'var(--text-muted)') + ';font-weight:' + (isMesAtual?'600':'400') + ';">' + nomeMeses[i] + '</div>' +
        '</div>';
      }).join('');

      return '<div class="card" style="margin-bottom:14px;">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
          '<div>' +
            '<div style="font-size:13px;font-weight:600;">' + (c?c.nome:'') + ' — ' + (p?p.nome:'') + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">💧 ' + u.descricao + (u.numero_serie?' · '+u.numero_serie:'') + (aut>0?' · Autorizado: <strong>'+aut.toFixed(1)+' m³/mês</strong>':'') + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:8px;align-items:center;">' +
            '<div style="text-align:center;background:' + (pctAno>100?'var(--red-light)':'var(--blue-light)') + ';padding:6px 12px;border-radius:8px;">' +
              '<div style="font-size:16px;font-weight:700;color:' + (pctAno>100?'var(--red)':'var(--blue)') + ';">' + pctAno + '%</div>' +
              '<div style="font-size:9px;color:var(--text-muted);">do autorizado ' + ano + '</div>' +
            '</div>' +
            '<div style="text-align:center;background:#f9fafb;padding:6px 12px;border-radius:8px;">' +
              '<div style="font-size:16px;font-weight:700;color:var(--text);">' + totalAno.toFixed(0) + '</div>' +
              '<div style="font-size:9px;color:var(--text-muted);">m³ captados</div>' +
            '</div>' +
            '<button class="btn btn-sm" onclick="lancarLeitura(this.dataset.id)" data-id="' + u.id + '">+ Lançar leitura</button>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:4px;align-items:flex-end;padding:8px 0;">' + barras + '</div>' +
        (aut>0?'<div style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:10px;color:var(--text-muted);"><div style="width:20px;height:1px;background:#E65100;"></div> Limite da outorga (' + aut.toFixed(1) + ' m³/mês)</div>':'') +
      '</div>';
    }).join('');
  }

  // =============================================
  // LANÇAR LEITURA MANUAL
  // =============================================
  let _lancarUsoId = null;
  let _lancarModo = 'leituras'; // 'leituras' ou 'consumo'

  function lancarModo(modo) {
    _lancarModo = modo;
    const btnL = document.getElementById('lancar-btn-leituras');
    const btnC = document.getElementById('lancar-btn-consumo');
    const blocoL = document.getElementById('lancar-bloco-leituras');
    const blocoC = document.getElementById('lancar-bloco-consumo');
    if (modo === 'leituras') {
      btnL.style.background = '#1565C0'; btnL.style.color = 'white';
      btnC.style.background = '#f9fafb'; btnC.style.color = 'var(--text-muted)';
      blocoL.style.display = 'block'; blocoC.style.display = 'none';
    } else {
      btnC.style.background = '#1565C0'; btnC.style.color = 'white';
      btnL.style.background = '#f9fafb'; btnL.style.color = 'var(--text-muted)';
      blocoC.style.display = 'block'; blocoL.style.display = 'none';
    }
  }

  function lancarLeitura(usoId) {
    _lancarUsoId = String(usoId);
    const u = usos.find(function(uu){ return uu.id === _lancarUsoId; });
    const c = u ? clientes.find(function(cc){ return cc.id === u.cliente_id; }) : null;
    const p = u ? propriedades.find(function(pp){ return pp.id === u.propriedade_id; }) : null;
    if (!u) return;
    document.getElementById('lancar-titulo').textContent = 'Lançar leitura — ' + u.descricao;
    document.getElementById('lancar-sub').textContent = (c?c.nome:'') + (p?' · '+p.nome:'');
    document.getElementById('lancar-mes').value = getMes();
    document.getElementById('lancar-ant').value = '';
    document.getElementById('lancar-atu').value = '';
    document.getElementById('lancar-consumo-direto').value = '';
    document.getElementById('lancar-obs').value = '';
    document.getElementById('lancar-consumo').style.display = 'none';
    document.getElementById('lancar-alerta').style.display = 'none';
    document.getElementById('lancar-alerta-direto').style.display = 'none';
    lancarModo('leituras'); // sempre começa no modo leituras
    abrirModal('ov-lancar');
  }

  function calcLancarConsumo() {
    const ant = parseFloat(document.getElementById('lancar-ant').value) || 0;
    const atu = parseFloat(document.getElementById('lancar-atu').value) || 0;
    const el = document.getElementById('lancar-consumo');
    if (atu > 0) {
      const consumo = atu - ant;
      document.getElementById('lancar-consumo-val').textContent = consumo.toFixed(1);
      el.style.display = 'block';
      const u = usos.find(function(uu){ return uu.id === _lancarUsoId; });
      const aut = u ? getAutorizadoUso(u) : 0;
      document.getElementById('lancar-alerta').style.display = (aut>0&&consumo>aut)?'inline':'none';
    } else {
      el.style.display = 'none';
    }
  }

  function calcLancarConsumoDirecto() {
    const consumo = parseFloat(document.getElementById('lancar-consumo-direto').value) || 0;
    const u = usos.find(function(uu){ return uu.id === _lancarUsoId; });
    const aut = u ? getAutorizadoUso(u) : 0;
    document.getElementById('lancar-alerta-direto').style.display = (aut>0&&consumo>aut)?'block':'none';
  }

  async function confirmarLancarLeitura() {
    const u = usos.find(function(uu){ return uu.id === _lancarUsoId; });
    if (!u) return;
    const mes = document.getElementById('lancar-mes').value;
    if (!mes) { alert('Selecione o mês de referência.'); return; }
    const obs = document.getElementById('lancar-obs').value.trim() || null;
    const aut = getAutorizadoUso(u);
    let lAnt, lAtu, consumo;

    if (_lancarModo === 'leituras') {
      lAnt = parseFloat(document.getElementById('lancar-ant').value) || 0;
      lAtu = parseFloat(document.getElementById('lancar-atu').value);
      if (isNaN(lAtu) || document.getElementById('lancar-atu').value === '') { alert('Informe a leitura atual.'); return; }
      if (lAtu < lAnt) { alert('Leitura atual não pode ser menor que a anterior.'); return; }
      consumo = lAtu - lAnt;
    } else {
      // Modo consumo direto — buscar última leitura para calcular lAnt e lAtu
      consumo = parseFloat(document.getElementById('lancar-consumo-direto').value);
      if (isNaN(consumo) || consumo <= 0) { alert('Informe o consumo do mês.'); return; }
      const ultLeits = await api('leituras?uso_id=eq.'+_lancarUsoId+'&select=leitura_atual,mes_referencia&order=mes_referencia.desc&limit=1') || [];
      lAnt = ultLeits.length ? (ultLeits[0].leitura_atual || 0) : 0;
      lAtu = lAnt + consumo;
    }

    // VALIDAÇÃO: já existe leitura para este ponto neste mês?
    const dup = await api('leituras?uso_id=eq.'+_lancarUsoId+'&mes_referencia=eq.'+mes+'&select=id,consumo_m3&limit=1') || [];
    if (dup.length > 0) {
      const escolha = confirm(
        '⚠️ Já existe uma leitura cadastrada para este ponto no mês ' + mes + '.\n' +
        'Consumo registrado anteriormente: ' + (dup[0].consumo_m3 || 0).toFixed(1) + ' m³.\n\n' +
        'Cada ponto só pode ter UMA leitura por mês.\n\n' +
        'Clique OK para SUBSTITUIR a leitura existente, ou Cancelar para manter a antiga.'
      );
      if (!escolha) return;
      // Substitui: atualiza ao invés de inserir
      const rUp = await api('leituras?id=eq.'+dup[0].id, 'PATCH', {
        leitura_anterior: lAnt,
        leitura_atual: lAtu,
        consumo_m3: consumo,
        observacao: obs,
        enviado_em: new Date().toISOString()
      }, 'return=minimal');
      if (rUp && rUp.ok) {
        fecharModal('ov-lancar');
        await carregarDados();
        carregarAcompanhamento();
        alert('✅ Leitura SUBSTITUÍDA! ' + u.descricao + ' · ' + mes + ' · ' + consumo.toFixed(1) + ' m³');
      } else {
        var errMsg = '';
        if (rUp) { try { errMsg = await rUp.text(); } catch(e) {} }
        alert('Erro ao substituir leitura.' + (errMsg ? '\n\n' + errMsg.substring(0,200) : ''));
      }
      return;
    }

    if (aut > 0 && consumo > aut) {
      if (!confirm('ATENÇÃO! Consumo de ' + consumo.toFixed(1) + ' m³ está ACIMA do autorizado (' + aut.toFixed(1) + ' m³). Confirmar mesmo assim?')) return;
    }

    const r = await api('leituras', 'POST', {
      uso_id: _lancarUsoId,
      cliente_id: u.cliente_id,
      leitura_anterior: lAnt,
      leitura_atual: lAtu,
      consumo_m3: consumo,
      mes_referencia: mes,
      observacao: obs,
      enviado_em: new Date().toISOString()
    }, 'return=minimal');

    if (r && r.ok) {
      fecharModal('ov-lancar');
      await carregarDados();
      carregarAcompanhamento();
      alert('Leitura lançada! ' + u.descricao + ' · ' + mes + ' · ' + consumo.toFixed(1) + ' m³');
    } else {
      alert('Erro ao salvar leitura. Verifique a conexão.');
    }
  }

  async function carregarDados() {
    try { clientes = await api('clientes?select=*&order=nome') || []; } catch(e) { clientes = []; }
    try { propriedades = await api('propriedades?select=*&order=nome') || []; } catch(e) { propriedades = []; }
    try { usos = await api('usos?select=*') || []; } catch(e) { usos = []; }
    try { contatos = await api('contatos?select=*') || []; } catch(e) { contatos = []; }
    try { leituras = await api('leituras?mes_referencia=eq.' + getMes() + '&select=*') || []; } catch(e) { leituras = []; }
    try { notificacoes = await api('notificacoes?select=*&order=prazo_resposta.asc') || []; } catch(e) { notificacoes = []; }
    try { documentos = await api('documentos?select=*&order=data_vencimento.asc') || []; } catch(e) { documentos = []; }
    renderDashboard();
    renderClientes(clientes);
    renderRenovacoes();
    atualizarBadgeNotif();
    atualizarBadgeDocs();
    popularSelectsRel();
    popularAcompClientes();
    popularAnoSelect();
    // Gráfico carrega depois para não bloquear a UI
    setTimeout(function() { iniciarGrafico(); }, 0);
  }

  function getAutorizadoUso(u) { return (u.vazao_m3h||0) * (u.horas_uso_dia||0) * (u.dias_uso_mes||0); }

  function getDiasVencUso(u, prop) {
    // Prioridade: dados do ponto, fallback para propriedade
    const dataEmissao = u.data_emissao || (prop && prop.data_emissao);
    const prazoAnos = u.prazo_anos || (prop && prop.prazo_anos);
    if (!dataEmissao || !prazoAnos) return null;
    const v = new Date(dataEmissao);
    v.setFullYear(v.getFullYear() + parseInt(prazoAnos,10));
    return Math.round((v - new Date()) / (1000*60*60*24));
  }

  // Retorna os dias até o vencimento mais próximo da propriedade.
  // Considera todos os usos (pontos) da propriedade — o que vence primeiro
  // determina o estado da propriedade. Fallback nos campos da própria propriedade
  // (compatibilidade com schema antigo).
  function getDiasVenc(prop) {
    if (!prop) return null;
    var ussDaProp = (typeof usos !== 'undefined' && usos)
      ? usos.filter(function(u){ return u.propriedade_id === prop.id; })
      : [];
    var diasMin = null;
    ussDaProp.forEach(function(u){
      var d = getDiasVencUso(u, prop);
      if (d === null) return;
      if (diasMin === null || d < diasMin) diasMin = d;
    });
    // Fallback: se nenhum uso tem data, usa dados da própria propriedade
    if (diasMin === null && prop.data_emissao && prop.prazo_anos) {
      var v = new Date(prop.data_emissao);
      v.setFullYear(v.getFullYear() + parseInt(prop.prazo_anos,10));
      diasMin = Math.round((v - new Date()) / (1000*60*60*24));
    }
    return diasMin;
  }

  function getCorVenc(dias, renovando) {
    if (renovando) return { fundo:'#E3F2FD', borda:'#1565C0', texto:'#1565C0', label:'EM RENOVAÇÃO' };
    if (dias === null) return null;
    const m = dias / 30;
    if (m <= 2) return { fundo:'#FFEBEE', borda:'#C62828', texto:'#C62828', label:'CRÍTICO - ' + Math.ceil(m) + ' MES(ES)' };
    if (m <= 5) return { fundo:'#FFF3E0', borda:'#E65100', texto:'#E65100', label:'ATENÇÃO - ' + Math.ceil(m) + ' MESES' };
    if (m <= 6) return { fundo:'#FFFDE7', borda:'#F9A825', texto:'#F9A825', label:'AVISO - 6 MESES' };
    return { fundo:'#F1F8E9', borda:'#2E7D32', texto:'#2E7D32', label:'EM DIA' };
  }

  // Helper: classifica urgência por dias até prazo
  function classificarPrazo(dias) {
    if (dias === null || dias === undefined) return { cls: 'cinza', txt: 'sem prazo', sortKey: 9999 };
    if (dias < 0) return { cls: 'vermelho', txt: 'Vencida há ' + Math.abs(dias) + 'd', sortKey: dias };
    if (dias <= 5) return { cls: 'vermelho', txt: dias === 0 ? 'Hoje' : (dias + ' dia(s)'), sortKey: dias };
    if (dias <= 10) return { cls: 'laranja', txt: dias + ' dias', sortKey: dias };
    if (dias <= 20) return { cls: 'amarelo', txt: dias + ' dias', sortKey: dias };
    if (dias <= 60) return { cls: 'cinza', txt: dias + ' dias', sortKey: dias };
    return { cls: 'cinza', txt: Math.ceil(dias/30) + ' meses', sortKey: dias };
  }

  function renderDashboard() {
    const clientesAtivos = clientes.filter(function(c){ return c.ativo !== false; });
    const usosComH = usos.filter(function(u) { return u.possui_hidrometro; });
    const usosComL = new Set(leituras.map(function(l) { return l.uso_id; }));
    const hoje = new Date();
    const diaMes = hoje.getDate();

    // Carregar lista de itens "concluídos localmente" para esconder
    let concluidos = {};
    try { concluidos = JSON.parse(localStorage.getItem('z_pend_concluidos') || '{}'); } catch(e) {}

    // ===== Coletar TODAS as pendências em uma lista única =====
    const pendencias = [];

    // 1) Notificações abertas (todas que tenham prazo definido)
    if (notificacoes && notificacoes.length) {
      notificacoes.forEach(function(n){
        if (n.status === 'respondida') return;
        const dias = diasParaPrazo(n.prazo_resposta);
        if (dias === null) return;  // sem prazo, ignora
        const c = clientes.find(function(cc){ return cc.id === n.cliente_id; });
        const idLocal = 'notif:' + n.id;
        if (concluidos[idLocal]) return;
        pendencias.push({
          id: idLocal,
          tipo: 'notificacao',
          tipoLabel: 'Notificação',
          tipoBadgeCls: 'badge-tipo-notif',
          titulo: (n.orgao || '?') + ' — ' + (n.tipo || ''),
          subtitulo: (c ? c.nome : '?') + (n.processo ? ' · ' + n.processo : ''),
          dias: dias,
          dataRef: n.prazo_resposta,
          acao: function(){ navTo('notificacoes'); },
          rotulo_acao: 'Abrir',
          // ID original para marcar status no banco
          notifId: n.id
        });
      });
    }

    // 2) Outorgas vencendo
    propriedades.forEach(function(p){
      const d = getDiasVenc(p);
      if (d === null) return;
      // Mostra apenas se vencendo em ≤ 6 meses ou já vencido
      if (d / 30 > 6) return;
      const c = clientes.find(function(cc){ return cc.id === p.cliente_id; });
      const ussDaProp = usos.filter(function(u){ return u.propriedade_id === p.id; });
      let usoAnc = null, dMin = null;
      ussDaProp.forEach(function(u){
        const dd = getDiasVencUso(u, p);
        if (dd === null) return;
        if (dMin === null || dd < dMin) { dMin = dd; usoAnc = u; }
      });
      const portariaP = (usoAnc && usoAnc.portaria) || p.portaria || '';
      const idLocal = 'outorga:' + p.id;
      if (concluidos[idLocal]) return;
      pendencias.push({
        id: idLocal,
        tipo: 'outorga',
        tipoLabel: 'Renovação',
        tipoBadgeCls: 'badge-tipo-renov',
        titulo: (c ? c.nome : '?') + ' — ' + p.nome,
        subtitulo: 'Outorga · Portaria ' + (portariaP || '—'),
        dias: d,
        dataRef: null,
        acao: function(){ navTo('renovacoes'); },
        rotulo_acao: 'Renovar'
      });
    });

    // 3) Leituras pendentes do mês — mostra a partir do dia 5 do mês
    const usosPendentes = usosComH.filter(function(u){ return !usosComL.has(u.id); });
    if (usosPendentes.length > 0 && diaMes >= 5) {
      // Calcula "dias até dia 15" como prazo
      const dia15 = new Date(hoje.getFullYear(), hoje.getMonth(), 15);
      const diasAtePrazoLeitura = Math.ceil((dia15 - hoje) / 86400000);
      const idLocal = 'leituras:' + getMes();
      if (!concluidos[idLocal]) {
        pendencias.push({
          id: idLocal,
          tipo: 'leituras',
          tipoLabel: 'Leituras',
          tipoBadgeCls: 'badge-tipo-leitura',
          titulo: usosPendentes.length + ' ponto(s) sem leitura',
          subtitulo: 'Mês de referência: ' + getMes(),
          dias: diasAtePrazoLeitura,
          dataRef: null,
          acao: function(){ navTo('alertas'); },
          rotulo_acao: 'Disparar'
        });
      }
    }

    // 4) Leituras acima do limite no mês
    const acimaMes = leituras.filter(function(l){
      const u = usos.find(function(uu){return uu.id===l.uso_id;});
      const aut = u ? getAutorizadoUso(u) : 0;
      return aut > 0 && (l.consumo_m3||0) > aut;
    });
    if (acimaMes.length > 0) {
      const idLocal = 'consumo:' + getMes();
      if (!concluidos[idLocal]) {
        pendencias.push({
          id: idLocal,
          tipo: 'consumo',
          tipoLabel: 'Consumo',
          tipoBadgeCls: 'badge-tipo-consumo',
          titulo: acimaMes.length + ' ponto(s) acima do autorizado',
          subtitulo: 'Mês ' + getMes() + ' · avaliar adequação',
          dias: 0,  // urgente: sempre vermelho (decisão imediata)
          dataRef: null,
          acao: function(){ navTo('leituras'); },
          rotulo_acao: 'Ver'
        });
      }
    }

    // 5) Documentos / Licenças vencendo em ≤90 dias (ou vencidos)
    if (documentos && documentos.length) {
      documentos.forEach(function(d){
        if (d.ativo === false) return;
        if (!d.data_vencimento) return;  // sem prazo, ignora
        const venc = new Date(d.data_vencimento + 'T00:00:00');
        if (isNaN(venc.getTime())) return;
        const hojeMid = new Date(); hojeMid.setHours(0,0,0,0);
        const dias = Math.ceil((venc - hojeMid) / 86400000);
        if (dias > 90) return;  // só pega vencendo em ≤3 meses (e vencidos)

        const idLocal = 'doc:' + d.id;
        if (concluidos[idLocal]) return;
        const c = clientes.find(function(cc){ return cc.id === d.cliente_id; });
        const tipo = (typeof getTipoDoc === 'function') ? getTipoDoc(d.tipo) : { label: d.tipo, icone:'📄' };
        pendencias.push({
          id: idLocal,
          tipo: 'documento',
          tipoLabel: 'Documento',
          tipoBadgeCls: 'badge-tipo-doc',
          titulo: tipo.icone + ' ' + tipo.label + (d.numero ? ' · Nº ' + d.numero : ''),
          subtitulo: (c ? c.nome : '?') + (d.titulo ? ' · ' + d.titulo : ''),
          dias: dias,
          dataRef: d.data_vencimento,
          acao: function(){ navTo('documentos'); },
          rotulo_acao: 'Abrir'
        });
      });
    }

    // ===== Cards de status =====
    const totalPend = pendencias.length;
    const prox7 = pendencias.filter(function(p){ return p.dias !== null && p.dias >= 0 && p.dias <= 7; }).length;
    const vencidas = pendencias.filter(function(p){ return p.dias < 0; }).length;

    document.getElementById('m-pend-total').textContent = totalPend;
    document.getElementById('m-pend-total-sub').textContent = totalPend === 0
      ? 'tudo em ordem ✓'
      : (vencidas > 0 ? vencidas + ' vencida(s) · ' + (totalPend - vencidas) + ' em aberto' : 'a resolver');

    document.getElementById('m-prox7').textContent = prox7;
    document.getElementById('m-prox7-sub').textContent = prox7 > 0 ? 'prazo(s) chegando' : 'nada esta semana ✓';

    document.getElementById('m-leit-mes').textContent = usosComL.size + '/' + usosComH.length;
    const pctLeit = usosComH.length > 0 ? Math.round(usosComL.size / usosComH.length * 100) : 0;
    document.getElementById('m-leit-mes-sub').textContent = pctLeit + '% recebidas · ' + usosPendentes.length + ' pendente(s)';
    const elBar = document.getElementById('m-leit-bar');
    if (elBar) elBar.style.width = pctLeit + '%';

    document.getElementById('m-carteira').textContent = clientesAtivos.length;
    document.getElementById('m-carteira-sub').textContent = clientesAtivos.length + ' cliente(s) · ' + usosComH.length + ' ponto(s) com hidrômetro';

    // ===== Lista única ordenada por urgência (menor prazo primeiro) =====
    pendencias.sort(function(a,b){
      const ka = classificarPrazo(a.dias).sortKey;
      const kb = classificarPrazo(b.dias).sortKey;
      return ka - kb;
    });

    const pendEl = document.getElementById('dash-pendencias-tudo');
    if (!pendencias.length) {
      pendEl.innerHTML = '<div class="dash-empty"><div class="dash-empty-emoji">🎉</div>Tudo em ordem!<br/>Nenhuma pendência no momento.</div>';
      return;
    }

    pendEl.innerHTML = pendencias.map(function(p, i){
      const c = classificarPrazo(p.dias);
      return '<div class="pend-item urg-' + c.cls + '" data-pend-idx="' + i + '" data-pend-id="' + p.id + '">'
        +'<input type="checkbox" class="pend-checkbox" title="Marcar como concluído"/>'
        +'<span class="pend-tipo-badge ' + p.tipoBadgeCls + '">' + p.tipoLabel + '</span>'
        +'<div class="pend-body">'
          +'<div class="pend-titulo">' + p.titulo + '</div>'
          +'<div class="pend-sub">' + p.subtitulo + '</div>'
        +'</div>'
        +'<div class="pend-prazo prazo-' + c.cls + '">' + c.txt + '</div>'
        +'<button class="pend-acao" data-pend-acao="' + i + '">' + p.rotulo_acao + ' →</button>'
      +'</div>';
    }).join('');

    // Bind dos botões de ação
    pendEl.querySelectorAll('button[data-pend-acao]').forEach(function(btn){
      const idx = parseInt(btn.dataset.pendAcao, 10);
      btn.addEventListener('click', function(){
        if (pendencias[idx] && pendencias[idx].acao) pendencias[idx].acao();
      });
    });

    // Bind dos checkboxes — concluir item
    pendEl.querySelectorAll('input.pend-checkbox').forEach(function(cb){
      cb.addEventListener('change', function(e){
        const itemEl = e.target.closest('.pend-item');
        if (!itemEl || !e.target.checked) return;
        const pendId = itemEl.dataset.pendId;
        const idx = parseInt(itemEl.dataset.pendIdx, 10);
        const item = pendencias[idx];
        if (!item) return;

        // Concluir: animação + persistência
        itemEl.classList.add('concluindo');
        setTimeout(function(){
          // Salva o ID em localStorage como concluído
          let conc = {};
          try { conc = JSON.parse(localStorage.getItem('z_pend_concluidos') || '{}'); } catch(_){}
          conc[pendId] = { em: new Date().toISOString() };
          try { localStorage.setItem('z_pend_concluidos', JSON.stringify(conc)); } catch(_){}

          // Para notificações: também atualiza status no banco para "respondida"
          if (item.tipo === 'notificacao' && item.notifId) {
            api('notificacoes?id=eq.' + item.notifId, 'PATCH', { status: 'respondida' }, 'return=minimal').then(function(){
              // Atualiza array local
              const n = (notificacoes || []).find(function(x){ return x.id === item.notifId; });
              if (n) n.status = 'respondida';
            }).catch(function(){});
          }

          // Re-renderiza
          renderDashboard();
        }, 300);
      });
    });
  }

  function renderClientes(lista) {
    const tbody = document.getElementById('tbl-clientes');
    const ativos = lista.filter(function(c){ return c.ativo !== false; });
    if (!ativos.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted)">Nenhum cliente cadastrado</td></tr>'; return; }
    tbody.innerHTML = ativos.map(function(c) {
      const props = propriedades.filter(function(p){return p.cliente_id===c.id;});
      const ussComH = usos.filter(function(u){return u.cliente_id===c.id && u.possui_hidrometro;});
      // Contato preferencial: principal se houver, senão telefone1 do cliente
      const ctsC = contatos.filter(function(ct){return ct.cliente_id===c.id;});
      const rep = ctsC.find(function(ct){return ct.principal;}) || ctsC.find(function(ct){return ct.papel==='responsavel_legal';});
      const contInfo = rep ? rep.nome + ' (' + rep.papel + ')' : (c.telefone1 || '—');
      return '<tr>' +
        '<td style="font-weight:500">' + c.nome + '</td>' +
        '<td style="font-size:11px;color:var(--text-muted)">' + (c.cpf_cnpj||'—') + '</td>' +
        '<td style="font-size:11px">' + contInfo + '</td>' +
        '<td><span class="badge badge-blue">' + props.length + ' prop.</span></td>' +
        '<td><span class="badge badge-gray">' + ussComH.length + ' hidrôm.</span></td>' +
        '<td><div style="display:flex;gap:3px;">' +
          '<button class="btn btn-sm" onclick="verCliente(\'' + c.id + '\')">Ver</button>' +
          '<button class="btn btn-sm" onclick="editarCliente(\'' + c.id + '\')">✏️</button>' +
          '<button class="btn btn-sm" style="background:#E8F5E9;color:#2E7D32;" onclick="definirPinCliente(\'' + c.id + '\')" title="Definir PIN do portal">🔑</button>' +
          '<button class="btn btn-sm btn-red" onclick="desativarCliente(\'' + c.id + '\',\'' + c.nome.replace(/'/g,"\\'") + '\')" title="Desativar">🚫</button>' +
          '<button class="btn btn-sm btn-danger" onclick="excluirCliente(\'' + c.id + '\',\'' + c.nome.replace(/'/g,"\\'") + '\')" title="Excluir definitivamente">🗑</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
  }

  function filtrarClientes(q) {
    if (!q) { renderClientes(clientes); return; }
    var reNaoDigito = /[^0-9]/g;
    var qNorm = (q||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    var qDig = q.replace(reNaoDigito, '');
    // Acha clientes cujos contatos batem (busca também em contatos)
    var cidsCts = contatos.filter(function(ct){
      var nm = (ct.nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      return nm.includes(qNorm) || (ct.telefone||'').includes(qDig);
    }).map(function(ct){ return ct.cliente_id; });
    renderClientes(clientes.filter(function(c) {
      var nm = (c.nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      var nome = nm.includes(qNorm);
      var doc = qDig.length >= 3 && (c.cpf_cnpj||'').replace(reNaoDigito,'').includes(qDig);
      var tel = qDig.length >= 4 && (c.telefone1||'').includes(qDig);
      var ctMatch = cidsCts.indexOf(c.id) >= 0;
      return nome || doc || tel || ctMatch;
    }));
  }

  async function excluirContato(ctId, cid) {
    if (!confirm('Remover este contato?')) return;
    await api('contatos?id=eq.' + ctId, 'DELETE', null, 'return=minimal');
    await carregarDados();
    verCliente(cid);
  }

  function verCliente(cid) {
    const c = clientes.find(function(cc){return cc.id===cid;});
    if (!c) return;
    clienteAtualId = cid;
    document.getElementById('tit-ver-cliente').textContent = c.nome;
    const cts = contatos.filter(function(ct){return ct.cliente_id===cid;});
    // Detectar duplicatas (mesmo nome + mesmo telefone + mesmo papel) para sinalizar
    const _ctSeen = {};
    cts.forEach(function(ct){
      const k = ((ct.nome||'').trim().toUpperCase()) + '|' + ((ct.telefone||'').replace(/\D/g,'')) + '|' + (ct.papel||'');
      _ctSeen[k] = (_ctSeen[k]||0) + 1;
    });
    let ctHtml = '<div style="font-size:12px;color:var(--text-muted);display:flex;flex-direction:column;gap:6px;">';
    ctHtml += '<div style="display:flex;gap:16px;flex-wrap:wrap;padding-bottom:4px;">';
    ctHtml += '<span>📞 ' + (c.telefone1||'—') + '</span>';
    if (c.email) ctHtml += '<span>✉ ' + c.email + '</span>';
    ctHtml += '</div>';
    cts.forEach(function(ct){
      const k = ((ct.nome||'').trim().toUpperCase()) + '|' + ((ct.telefone||'').replace(/\D/g,'')) + '|' + (ct.papel||'');
      const dup = _ctSeen[k] > 1 ? ' <span style="background:#FFF3E0;color:#E65100;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px;margin-left:4px;">DUPLICADO</span>' : '';
      ctHtml += '<div style="display:flex;align-items:center;gap:8px;background:#f9fafb;border-radius:8px;padding:6px 10px;">' +
        '<span style="flex:1;">👤 <strong>' + ct.nome + '</strong> (' + ct.papel + ')' + (ct.telefone ? ' · ' + ct.telefone : '') + dup + '</span>' +
        '<button class="btn btn-sm btn-danger" style="padding:2px 8px;font-size:11px;" onclick="excluirContato(\'' + ct.id + '\',\'' + cid + '\')">✕</button>' +
        '</div>';
    });
    ctHtml += '</div>';
    document.getElementById('ver-cliente-contatos').innerHTML = ctHtml;

    const props = propriedades.filter(function(p){return p.cliente_id===cid;});
    if (!props.length) {
      document.getElementById('ver-cliente-props').innerHTML = '<p style="font-size:13px;color:var(--text-muted);padding:20px 0;text-align:center;">Nenhuma propriedade cadastrada ainda.</p>';
    } else {
      document.getElementById('ver-cliente-props').innerHTML = props.map(function(p) {
        const uss = usos.filter(function(u){return u.propriedade_id===p.id;});
        const dias = getDiasVenc(p);
        const cor = getCorVenc(dias, false);
        const vencHtml = cor && dias !== null ? '<span class="tag-v" style="background:'+cor.fundo+';color:'+cor.texto+'">'+cor.label+'</span>' : '';
        return '<div class="prop-card">' +
          '<div class="prop-card-header">' +
            '<div>' +
              '<div style="font-size:13px;font-weight:600;">' + p.nome + ' ' + vencHtml + '</div>' +
              '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">' + (p.cidade||'') + (p.estado?' - '+p.estado:'') + (p.portaria?' · Port. '+p.portaria:'') + (p.processo?' · '+p.processo:'') + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:4px;">' +
              '<button class="btn btn-sm btn-blue" onclick="abrirAddUso(\'' + p.id + '\')">+ Ponto</button>' +
              '<button class="btn btn-sm" onclick="editarPropriedade(\'' + p.id + '\')">✏️</button>' +
              '<button class="btn btn-sm btn-danger" onclick="excluirProp(\'' + p.id + '\',\'' + p.nome.replace(/'/g,"\\'") + '\')">🗑</button>' +
            '</div>' +
          '</div>' +
          '<div class="prop-card-body">' +
            (uss.length ? uss.map(function(u) {
              const aut = getAutorizadoUso(u);
              const hasH = u.possui_hidrometro;
              const icone = hasH ? '💧' : '🔵';
              const link = hasH ? CLIENTE_URL + '?token=' + u.token : null;
              // Lista de todos os telefones do cliente
              const _cts = contatos.filter(function(ct){ return ct.cliente_id === u.cliente_id && ct.telefone; });
              const _cli = clientes.find(function(cc){ return cc.id === u.cliente_id; });
              const _fones = [];
              if (_cli && _cli.telefone1) _fones.push({nome: _cli.nome.split(' ')[0] + ' (titular)', fone: _cli.telefone1});
              _cts.forEach(function(ct){ _fones.push({nome: ct.nome.split(' ')[0] + ' (' + ct.papel + ')', fone: ct.telefone}); });
              return '<div class="uso-row">' +
                (u.foto_equipamento_url ? 
                  '<a href="' + u.foto_equipamento_url + '" target="_blank"><img src="' + u.foto_equipamento_url + '" style="width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid var(--border);flex-shrink:0;" alt="Foto" /></a>' :
                  '<div class="uso-icon" style="background:' + (hasH?'var(--blue-light)':'#f3f4f6') + '">' + icone + '</div>'
                ) +
                '<div style="flex:1;">' +
                  '<div style="font-size:12px;font-weight:500;">' + u.descricao + (u.numero_serie?' <span style="font-family:monospace;font-size:11px;color:var(--text-muted)">' + u.numero_serie + '</span>':'') + '</div>' +
                  '<div style="font-size:11px;color:var(--text-muted);">' + (u.requerimento||'') + (aut>0?' · Auto: '+aut.toFixed(1)+' m³/mês':'') + '</div>' +
                '</div>' +
                (link ? '<a href="' + link + '" target="_blank" class="btn btn-sm btn-blue" title="Abrir/copiar link de leitura">🔗 Link</a>' : '<span class="badge badge-gray">Sem hidrômetro</span>') +
                (u.outorga_pdf_url ? '<a href="' + u.outorga_pdf_url + '" target="_blank" class="btn btn-sm" style="background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;" title="Abrir PDF da outorga / licença">📄 PDF</a>' : '<span class="btn btn-sm" style="background:#f3f4f6;color:#9ca3af;border:1px dashed #d1d5db;cursor:default;" title="Sem PDF anexado">📄 –</span>') +
                (link ? (u.responsavel_tel ?
                  '<button class="btn btn-sm btn-green" onclick="enviarLinkWpp(\'' + u.id + '\',\'' + u.responsavel_tel + '\')" title="Enviar para responsável fixo">📲 Enviar</button>' :
                  _fones.length <= 1 ?
                    '<button class="btn btn-sm btn-green" onclick="enviarLinkWpp(\'' + u.id + '\',\'' + (_fones[0]?_fones[0].fone:'') + '\')" title="Enviar link por WhatsApp">📲 Enviar</button>' :
                    '<button class="btn btn-sm btn-green" onclick="selecionarContatoWpp(\'' + u.id + '\')" title="Escolher para quem enviar">📲 Enviar ▾</button>'
                ) : '') +
                '<button class="btn btn-sm" onclick="editarUso(\'' + u.id + '\')">✏️</button>' +
                '<button class="btn btn-sm btn-danger" onclick="excluirUso(\'' + u.id + '\',\'' + u.descricao.replace(/'/g,"\\'") + '\')">🗑</button>' +
              '</div>';
            }).join('') : '<p style="font-size:12px;color:var(--text-muted);padding:8px 0;">Nenhum ponto de captação cadastrado. <button class="btn btn-sm btn-blue" onclick="abrirAddUso(\'' + p.id + '\')">+ Adicionar</button></p>') +
          '</div>' +
        '</div>';
      }).join('');
    }
    abrirModal('ov-ver-cliente');
  }

  // =============================================
  // ENVIO DE LINK DE LEITURA POR WHATSAPP
  // =============================================
  function enviarLinkWpp(usoId, fone) {
    const u = usos.find(function(uu){ return uu.id === usoId; });
    const c = u ? clientes.find(function(cc){ return cc.id === u.cliente_id; }) : null;
    const p = u ? propriedades.find(function(pp){ return pp.id === u.propriedade_id; }) : null;
    if (!fone || !u) { alert('Nenhum telefone disponível para este contato.'); return; }
    const num = fone.replace(/\D/g, '');
    const primeiroNome = c ? c.nome.split(' ')[0] : '';
    const nomePropriedade = p ? p.nome : '';
    const nomePonto = u.descricao || '';
    const nomeEng = EMPRESA.eng || 'Eng. Guilherme Montanari';
    const telEng = EMPRESA.tel || '(16) 98142-7633';
    const linkLeitura = CLIENTE_URL + '?token=' + u.token;
    const linhaReq = u.requerimento ? '📋 *Requerimento:* ' + u.requerimento + '\n' : '';
    const linhaSerie = u.numero_serie ? '🔢 *Hidrômetro:* ' + u.numero_serie + '\n' : '';
    const msg = encodeURIComponent(
      'Olá, ' + primeiroNome + '!\n\n' +
      '*Zello Ambiental — Gestão da Água*\n' +
      'Chegou o momento de registrar a leitura mensal do hidrômetro.\n\n' +
      '*Propriedade:* ' + nomePropriedade + '\n' +
      '*Ponto:* ' + nomePonto + '\n' +
      linhaReq +
      linhaSerie + '\n' +
      'Acesse o link para informar a leitura:\n' +
      linkLeitura + '\n\n' +
      'Em caso de dúvidas:\n' +
      nomeEng + ' · ' + telEng
    );
    window.open('https://wa.me/55' + num + '?text=' + msg, '_blank');
  }

  function selecionarContatoWpp(usoId) {
    const u = usos.find(function(uu){ return uu.id === usoId; });
    const c = u ? clientes.find(function(cc){ return cc.id === u.cliente_id; }) : null;
    if (!u || !c) return;
    // Montar lista de todos os telefones
    const cts = contatos.filter(function(ct){ return ct.cliente_id === u.cliente_id && ct.telefone; });
    const fones = [];
    if (c.telefone1) fones.push({ nome: c.nome.split(' ')[0] + ' (titular)', fone: c.telefone1 });
    cts.forEach(function(ct){ fones.push({ nome: ct.nome.split(' ')[0] + ' (' + ct.papel + ')', fone: ct.telefone }); });
    if (!fones.length) { alert('Nenhum telefone cadastrado para este cliente.'); return; }
    // Abrir modal de seleção
    const overlay = document.getElementById('ov-selecionar-contato');
    const lista = document.getElementById('lista-contatos-wpp');
    document.getElementById('tit-selecionar-contato').textContent = 'Enviar link — ' + u.descricao;
    lista.innerHTML = '';
    fones.forEach(function(f) {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.cssText = 'width:100%;justify-content:flex-start;margin-bottom:8px;gap:12px;';
      btn.innerHTML = '<span style="font-size:18px;">📲</span><span><strong>' + f.nome + '</strong><br/><span style="font-size:11px;color:var(--text-muted);">' + f.fone + '</span></span>';
      btn.addEventListener('click', function() {
        enviarLinkWpp(usoId, f.fone);
        fecharModal('ov-selecionar-contato');
      });
      lista.appendChild(btn);
    });
    overlay.classList.add('open');
  }

  function popularSelectResponsavel(cid, valorAtual) {
    const sel = document.getElementById('u-responsavel');
    if (!sel) return;
    sel.innerHTML = '<option value="">— Sem responsável fixo (escolher ao enviar) —</option>';
    const c = clientes.find(function(cc){ return cc.id === cid; });
    // Conjunto para deduplicar telefones (titular + contatos podem repetir)
    const _vistos = {};
    if (c && c.telefone1) {
      const k = c.telefone1.replace(/\D/g,'');
      if (!_vistos[k]) {
        _vistos[k] = true;
        const opt = document.createElement('option');
        opt.value = c.telefone1;
        opt.textContent = c.nome.split(' ')[0] + ' (titular) · ' + c.telefone1;
        sel.appendChild(opt);
      }
    }
    const cts = contatos.filter(function(ct){ return ct.cliente_id === cid && ct.telefone; });
    cts.forEach(function(ct) {
      const k = (ct.telefone||'').replace(/\D/g,'') + '|' + (ct.nome||'').trim().toUpperCase();
      if (_vistos[k]) return;
      _vistos[k] = true;
      const opt = document.createElement('option');
      opt.value = ct.telefone;
      opt.textContent = ct.nome.split(' ')[0] + ' (' + ct.papel + ') · ' + ct.telefone;
      sel.appendChild(opt);
    });
    // Opção para digitar um número avulso
    const optOutro = document.createElement('option');
    optOutro.value = 'outro';
    optOutro.textContent = '✏️ Digitar outro número...';
    sel.appendChild(optOutro);
    if (valorAtual) sel.value = valorAtual;
    sel.onchange = function() {
      var div = document.getElementById('u-responsavel-outro');
      if (div) div.style.display = sel.value === 'outro' ? 'block' : 'none';
    };
  }

  function abrirAddUso(pid) {
    propAtualId = pid;
    fecharModal('ov-ver-cliente');
    const p = propriedades.find(function(pp){return pp.id===pid;});
    document.getElementById('uso-sub').textContent = p ? p.nome : 'Novo ponto';
    document.querySelector('#ov-uso .modal-title').textContent = 'Cadastrar ponto de captação';
    limparFormUso();
    document.getElementById('lista-usos-adicionados').innerHTML = '';
    // Popular select de responsável com contatos do cliente
    if (clienteAtualId) popularSelectResponsavel(clienteAtualId, null);
    // No contexto de cliente existente, ocultar "+ Adicionar outro ponto"
    var btnAdicionar = document.getElementById('btn-uso-add-outro');
    if (btnAdicionar) btnAdicionar.style.display = 'none';
    document.getElementById('btn-salvar-uso').textContent = 'Salvar ponto';
    document.getElementById('btn-salvar-uso').onclick = function() {
      salvarUso(true).then(function() {
        if (clienteAtualId) verCliente(clienteAtualId);
      });
    };
    abrirModal('ov-uso');
  }

  // =============================================
  // ADICIONAR PROPRIEDADE A UM CLIENTE EXISTENTE
  // =============================================
  function abrirAddProp() {
    if (!clienteAtualId) {
      alert('Selecione um cliente primeiro.');
      return;
    }
    fecharModal('ov-ver-cliente');
    // Limpar formulário
    document.getElementById('eid-prop').value = '';
    document.getElementById('p-nome').value = '';
    document.getElementById('p-cidade').value = '';
    document.getElementById('p-estado').value = 'SP';
    // Ajustar título e subtítulo
    document.querySelector('#ov-prop .modal-title').textContent = 'Nova propriedade';
    var cli = clientes.find(function(c){ return c.id === clienteAtualId; });
    var sub = document.getElementById('prop-sub');
    if (sub) sub.textContent = 'Adicionar propriedade' + (cli ? ' — ' + cli.nome : '');
    // Restaurar texto do botão salvar (caso edição anterior tenha alterado)
    var btnSalvar = document.querySelector('#ov-prop .btn-blue');
    if (btnSalvar) btnSalvar.textContent = 'Salvar e continuar →';
    // Pré-carrega cidades de SP em background
    _buscarCidadeOnline('SP');
    abrirModal('ov-prop');
  }

  function editarPropriedade(pid) {
    const p = propriedades.find(function(pp){return pp.id===pid;});
    if (!p) return;
    propAtualId = pid;
    clienteAtualId = p.cliente_id;
    fecharModal('ov-ver-cliente');

    document.getElementById('eid-prop').value = pid;
    document.getElementById('p-nome').value = p.nome || '';
    document.getElementById('p-cidade').value = p.cidade || '';
    document.getElementById('p-estado').value = p.estado || 'SP';
    // (campos p-processo/p-portaria/p-pdf não existem no modal atual — bloco removido
    //  para evitar TypeError que travava o botão "✏️" da propriedade.)

    document.querySelector('#ov-prop .modal-title').textContent = 'Editar propriedade';
    document.getElementById('prop-sub').textContent = 'Editando: ' + p.nome;

    const btnSalvar = document.querySelector('#ov-prop .btn-blue');
    if (btnSalvar) btnSalvar.textContent = 'Salvar alterações';
    // Não sobrescrever onclick — usar eid-prop para detectar modo

    // Pré-carrega cidades do estado da propriedade
    _buscarCidadeOnline(p.estado || 'SP');

    abrirModal('ov-prop');
  }

  // salvarPropEdicao foi incorporada em salvarPropriedade


  function editarCliente(cid) {
    const c = clientes.find(function(cc){return cc.id===cid;});
    if (!c) return;
    clienteAtualId = cid;
    limparFormCliente();
    document.getElementById('eid-cliente').value = cid;
    document.getElementById('tit-cliente').textContent = 'Editar cliente';
    document.getElementById('c-nome').value = c.nome||'';
    document.getElementById('c-doc').value = c.cpf_cnpj||'';
    document.getElementById('c-tel1').value = c.telefone1||'';
    document.getElementById('c-email').value = c.email||'';
    // Detectar CNPJ e preencher responsáveis legais
    detectarTipoCliente();
    limparResponsaveisLegais();
    const ctsCliente = contatos.filter(function(ct){ return ct.cliente_id === cid; });
    const respLegaisEditar = ctsCliente.filter(function(ct){ return ct.papel==='responsavel_legal'; });
    respLegaisEditar.forEach(function(rl) {
      adicionarResponsavelLegal();
      const idx2 = document.getElementById('lista-resp-legais').children.length - 1;
      const elNome = document.getElementById('resp-legal-nome-'+idx2); if(elNome) elNome.value = rl.nome||'';
      const elCpf = document.getElementById('resp-legal-cpf-'+idx2); if(elCpf) elCpf.value = rl.cpf||'';
      const elTel = document.getElementById('resp-legal-tel-'+idx2); if(elTel) elTel.value = rl.telefone||'';
      const elEmail = document.getElementById('resp-legal-email-'+idx2); if(elEmail) elEmail.value = rl.email||'';
    });

    // Carregar contatos existentes deste cliente
    // Responsável principal era campo antigo (removido) — contatos extras tratados abaixo

    // Preencher contatos extras (não principais e não responsáveis legais)
    document.getElementById('contatos-extras').innerHTML = '';
    contatosExtras = [];
    // Deduplica antes de mostrar (caso o banco tenha contatos duplicados de cadastros antigos)
    const ctExtrasRaw = ctsCliente.filter(function(ct){ return !ct.principal && ct.papel !== 'responsavel_legal'; });
    const _ctVistos = {};
    const ctExtras = [];
    ctExtrasRaw.forEach(function(ct){
      const k = ((ct.nome||'').trim().toUpperCase()) + '|' + ((ct.telefone||'').replace(/\D/g,'')) + '|' + (ct.papel||'');
      if (_ctVistos[k]) return;
      _ctVistos[k] = true;
      ctExtras.push(ct);
    });
    ctExtras.forEach(function(ct) {
      const idx = contatosExtras.length;
      contatosExtras.push({});
      const el = document.getElementById('contatos-extras');
      const div = document.createElement('div');
      div.className = 'contato-extra';
      div.id = 'contato-extra-' + idx;
      div.innerHTML = '<button class="contato-remove" onclick="removerContatoExtra(' + idx + ')">✕</button>' +
        '<div class="g2">' +
        '<div class="fg"><label class="fl">Nome</label><input class="fi upper" type="text" id="ce-nome-' + idx + '" value="' + (ct.nome||'') + '" placeholder="Nome do contato" /></div>' +
        '<div class="fg"><label class="fl">Papel</label><select class="fi" id="ce-papel-' + idx + '"><option value="conjuge">Cônjuge</option><option value="pai_mae">Pai/Mãe</option><option value="filho_filha">Filho/Filha</option><option value="irmao_irma">Irmão/Irmã</option><option value="gerente">Gerente / Responsável</option><option value="advogado">Advogado</option><option value="contador">Contador</option><option value="intermediador">Intermediador</option><option value="outro">Outro</option></select></div>' +
        '<div class="fg"><label class="fl">Telefone</label><input class="fi" type="tel" id="ce-tel-' + idx + '" value="' + (ct.telefone||'') + '" placeholder="(16) 99999-0000" maxlength="15" oninput="mascaraTel(this)" /></div>' +
        '<div class="fg"><label class="fl">E-mail</label><input class="fi" type="email" id="ce-email-' + idx + '" value="' + (ct.email||'') + '" placeholder="email@dominio.com" /></div>' +
        '</div>';
      el.appendChild(div);
      // Selecionar o papel correto
      const sel = div.querySelector('#ce-papel-' + idx);
      if (sel) sel.value = ct.papel || 'outro';
    });

    // Mudar texto do botão para modo edição (onclick não muda — salvarCliente detecta pelo eid)
    const btnCli = document.querySelector('#ov-cliente .btn-blue');
    if (btnCli) btnCli.textContent = 'Salvar alterações';

    abrirModal('ov-cliente');
  }

  async function editarUso(uid) {
    const u = usos.find(function(uu){return uu.id===uid;});
    if (!u) return;
    propAtualId = u.propriedade_id;
    clienteAtualId = u.cliente_id;
    fecharModal('ov-ver-cliente');
    limparFormUso();
    // Em modo edição, esconder o botão "+ Adicionar outro ponto"
    var _btnAddOutro = document.getElementById('btn-uso-add-outro');
    if (_btnAddOutro) _btnAddOutro.style.display = 'none';
    document.getElementById('eid-uso').value = uid;
    document.getElementById('u-desc').value = u.descricao||'';
    document.getElementById('u-tipo').value = u.tipo_outorga||'outorga';
    document.getElementById('u-req').value = u.requerimento||'';
    document.getElementById('u-portaria').value = u.portaria||'';
    document.getElementById('u-processo').value = u.processo||'';
    document.getElementById('u-data-emissao').value = u.data_emissao||'';
    document.getElementById('u-prazo').value = u.prazo_anos||'';
    document.getElementById('u-vh').value = u.vazao_m3h||'';
    document.getElementById('u-hd').value = u.horas_uso_dia||'';
    document.getElementById('u-dm').value = u.dias_uso_mes||'';
    document.getElementById('u-sem-hidro').checked = !u.possui_hidrometro;
    document.getElementById('u-serie').value = u.numero_serie||'';
    toggleHidroInput(!u.possui_hidrometro);
    calcVazao();

    // Mostrar PDF atual da outorga (se houver)
    const pdfAtualEl = document.getElementById('u-pdf-atual');
    if (pdfAtualEl) {
      if (u.outorga_pdf_url) {
        pdfAtualEl.innerHTML = '📄 <a href="' + u.outorga_pdf_url + '" target="_blank" style="color:#E65100;font-weight:600;">Ver PDF atual</a> <span style="color:var(--text-muted);">— selecione um arquivo acima para substituir</span>';
        pdfAtualEl.style.display = 'block';
      } else {
        pdfAtualEl.style.display = 'none';
      }
    }
    // Mostrar foto atual (se houver)
    const fotoAtualEl = document.getElementById('u-foto-atual');
    if (fotoAtualEl) {
      if (u.foto_equipamento_url) {
        fotoAtualEl.innerHTML = '<a href="' + u.foto_equipamento_url + '" target="_blank"><img src="' + u.foto_equipamento_url + '" style="width:60px;height:60px;border-radius:6px;object-fit:cover;border:1px solid var(--border);vertical-align:middle;" alt="Foto atual"/></a> <span style="color:var(--text-muted);">Foto atual — selecione um arquivo acima para substituir</span>';
        fotoAtualEl.style.display = 'block';
      } else {
        fotoAtualEl.style.display = 'none';
      }
    }

    // Popular select responsável com valor atual
    if (clienteAtualId) popularSelectResponsavel(clienteAtualId, u.responsavel_tel || null);
    document.querySelector('#ov-uso .modal-title').textContent = 'Editar ponto de captação';
    const _btnSalvar = document.getElementById('btn-salvar-uso');
    if (_btnSalvar) {
      _btnSalvar.textContent = 'Salvar alterações';
      _btnSalvar.onclick = function() { salvarUsoEdicao(uid); };
    }
    abrirModal('ov-uso');
  }

  async function salvarUsoEdicao(uid) {
    const desc = document.getElementById('u-desc').value.trim();
    if (!desc) { alert('Descrição é obrigatória.'); return; }
    const semHidro = document.getElementById('u-sem-hidro').checked;

    // Upload de foto se nova foto foi selecionada
    const fotoInput = document.getElementById('u-foto');
    let fotoUrl = null;
    if (fotoInput && fotoInput.files && fotoInput.files[0]) {
      const fotoFile = fotoInput.files[0];
      const fotoExt = fotoFile.name.split('.').pop() || 'jpg';
      fotoUrl = await uploadFile('documentos-zello', 'fotos/' + clienteAtualId + '/' + Date.now() + '.' + fotoExt, fotoFile);
      if (!fotoUrl) alert('⚠️ Falha ao enviar a foto. Verifique a conexão e tente novamente.');
    }

    // Upload de PDF da outorga se um novo foi selecionado
    const pdfInputE = document.getElementById('u-pdf-outorga');
    let pdfUrlE = null;
    if (pdfInputE && pdfInputE.files && pdfInputE.files[0]) {
      pdfUrlE = await uploadFile('documentos-zello', 'outorgas/' + clienteAtualId + '/' + Date.now() + '.pdf', pdfInputE.files[0]);
      if (!pdfUrlE) alert('⚠️ Falha ao enviar o PDF da outorga. Verifique a conexão e tente novamente.');
    }

    const payload = {
      descricao: upper(desc),
      tipo_outorga: document.getElementById('u-tipo').value,
      requerimento: upper(document.getElementById('u-req').value.trim()) || null,
      portaria: document.getElementById('u-portaria').value.trim() || null,
      processo: document.getElementById('u-processo').value.trim() || null,
      data_emissao: document.getElementById('u-data-emissao').value || null,
      prazo_anos: parseInt(document.getElementById('u-prazo').value) || null,
      vazao_m3h: parseFloat(document.getElementById('u-vh').value) || null,
      horas_uso_dia: parseFloat(document.getElementById('u-hd').value) || null,
      dias_uso_mes: parseInt(document.getElementById('u-dm').value) || null,
      possui_hidrometro: !semHidro,
      numero_serie: semHidro ? null : (upper(document.getElementById('u-serie').value.trim()) || null),
      responsavel_tel: document.getElementById('u-responsavel').value || null
    };
    if (fotoUrl) payload.foto_equipamento_url = fotoUrl; // só atualiza se nova foto anexada
    if (pdfUrlE) payload.outorga_pdf_url = pdfUrlE;       // só atualiza se novo PDF anexado

    var rEd = await api('usos?id=eq.' + uid, 'PATCH', payload, 'return=minimal');
    if (rEd && !rEd.ok) {
      var errEd = await rEd.text();
      console.error('[Zello] Erro PATCH usos:', errEd);
      // Tenta retry removendo as colunas que faltam
      var colsRem = [];
      ['portaria','processo','data_emissao','prazo_anos','tipo_outorga','requerimento','outorga_pdf_url','foto_equipamento_url'].forEach(function(col){
        if (errEd.indexOf(col) > -1 && payload.hasOwnProperty(col)) {
          colsRem.push(col);
          delete payload[col];
        }
      });
      if (colsRem.length > 0) {
        rEd = await api('usos?id=eq.' + uid, 'PATCH', payload, 'return=minimal');
        if (!rEd || !rEd.ok) { alert('Erro ao atualizar ponto: ' + (rEd ? await rEd.text() : '')); return; }
        var nomes = {'portaria':'Portaria','processo':'Processo SEI','data_emissao':'Data de emissão','prazo_anos':'Prazo (anos)','tipo_outorga':'Tipo de outorga','requerimento':'Requerimento','outorga_pdf_url':'PDF da outorga','foto_equipamento_url':'Foto do equipamento'};
        var labels = colsRem.map(function(c){return nomes[c]||c;}).join(', ');
        var sqlFix2 = colsRem.map(function(c){
          var tipos = {'portaria':'TEXT','processo':'TEXT','data_emissao':'DATE','prazo_anos':'INTEGER','tipo_outorga':'TEXT','requerimento':'TEXT','outorga_pdf_url':'TEXT','foto_equipamento_url':'TEXT'};
          return 'ALTER TABLE usos ADD COLUMN IF NOT EXISTS ' + c + ' ' + (tipos[c]||'TEXT') + ';';
        }).join('\n');
        alert('⚠️ Ponto atualizado, MAS estes campos NÃO foram gravados (colunas não existem):\n\n' +
              '• ' + labels + '\n\n' +
              'Execute no Supabase:\n\n' + sqlFix2);
      } else {
        alert('Erro ao atualizar ponto: ' + errEd.substring(0,200));
        return;
      }
    }

    document.getElementById('eid-uso').value = '';
    document.getElementById('btn-salvar-uso').onclick = function() { salvarUso(true); };
    fecharModal('ov-uso');
    await carregarDados();
    verCliente(clienteAtualId);
    alert('Ponto atualizado!');
  }

  // =============================================
  // RENOVAÇÕES
  // =============================================
  function renderRenovacoes() {
    const el = document.getElementById('lista-renovacoes');
    if (!el) return;

    // Considera todas as propriedades cujo getDiasVenc retorna valor
    // (ou seja: tem ao menos 1 uso com data de emissão+prazo, OU campos antigos na propriedade)
    const lista = propriedades
      .filter(function(p){ return p.ativo !== false; })
      .map(function(p) {
        const dias = getDiasVenc(p);
        if (dias === null) return null;
        const ussDaProp = usos.filter(function(u){return u.propriedade_id===p.id;});
        const renovando = ussDaProp.some(function(u){return u.renovacao_em_andamento;});
        // Identifica o uso "âncora" — o que está vencendo primeiro
        let usoAncora = null;
        let diasMin = null;
        ussDaProp.forEach(function(u){
          const d = getDiasVencUso(u, p);
          if (d === null) return;
          if (diasMin === null || d < diasMin) { diasMin = d; usoAncora = u; }
        });
        return { prop: p, dias: dias, renovando: renovando, usoAncora: usoAncora, ussDaProp: ussDaProp };
      })
      .filter(function(x){ return x !== null; })
      .sort(function(a,b){ return a.dias - b.dias; });

    const badge = document.getElementById('badge-renov');
    const criticos = lista.filter(function(x){ return !x.renovando && x.dias/30 <= 6; }).length;
    if (badge) { badge.textContent = criticos; badge.style.display = criticos > 0 ? 'block' : 'none'; }

    // === SEÇÃO DE DIAGNÓSTICO ===
    // Mostra propriedades que estão SEM dados de outorga (data_emissao/prazo_anos)
    // pra ajudar a entender por que algo não aparece.
    const semDados = propriedades.filter(function(p){
      if (p.ativo === false) return false;
      return getDiasVenc(p) === null;
    });

    let diagHtml = '';
    if (semDados.length > 0) {
      diagHtml = '<div class="card" style="background:#FFFBEB;border:1px solid #FCD34D;margin-bottom:14px;">' +
        '<div style="font-size:12px;font-weight:700;color:#92400E;margin-bottom:8px;">⚠ ' + semDados.length + ' propriedade(s) sem data de outorga cadastrada</div>' +
        '<div style="font-size:11px;color:#78350F;margin-bottom:8px;">Estas propriedades não aparecem no ranking porque nenhum dos pontos tem <strong>Data de emissão</strong> + <strong>Prazo (anos)</strong> preenchidos. Edite o ponto para cadastrar.</div>' +
        '<div style="display:flex;flex-direction:column;gap:4px;">' +
        semDados.map(function(p){
          const c = clientes.find(function(cc){return cc.id===p.cliente_id;});
          const ussP = usos.filter(function(u){return u.propriedade_id===p.id;});
          const usoStr = ussP.map(function(u){
            const temData = !!u.data_emissao;
            const temPrazo = !!u.prazo_anos;
            return u.descricao + ' (' + (temData?'data ✓':'sem data') + ', ' + (temPrazo?'prazo ✓':'sem prazo') + ')';
          }).join(', ') || 'sem pontos cadastrados';
          return '<div style="font-size:11px;background:white;padding:6px 10px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;gap:8px;">' +
            '<span><strong>' + (c?c.nome:'?') + '</strong> · ' + p.nome + '<br><span style="color:#9ca3af;font-size:10px;">' + usoStr + '</span></span>' +
            '<button class="btn btn-sm" onclick="verCliente(\'' + p.cliente_id + '\')">Abrir cliente</button>' +
            '</div>';
        }).join('') +
        '</div>' +
        '</div>';
    }

    if (!lista.length) {
      el.innerHTML = diagHtml + '<div class="card" style="text-align:center;padding:32px;color:var(--text-muted)">Nenhuma outorga com data de vencimento cadastrada nos pontos de captação.</div>';
      return;
    }

    const listaHtml = lista.map(function(x, idx) {
      const p = x.prop;
      const c = clientes.find(function(cc){return cc.id===p.cliente_id;});
      const cor = getCorVenc(x.dias, x.renovando);
      if (!cor) return '';
      // Usa o uso âncora pra calcular a data, com fallback pros campos antigos da propriedade
      const usoBase = x.usoAncora;
      const dataEmBase = (usoBase && usoBase.data_emissao) || p.data_emissao;
      const prazoBase = (usoBase && usoBase.prazo_anos) || p.prazo_anos;
      const venc = new Date(dataEmBase);
      venc.setFullYear(venc.getFullYear() + parseInt(prazoBase,10));
      // Portaria/processo do uso âncora ou da propriedade
      const portariaBase = (usoBase && usoBase.portaria) || p.portaria || '';
      const processoBase = (usoBase && usoBase.processo) || p.processo || '';
      const uss = x.ussDaProp;
      const usoComPdf = uss.find(function(u){return u.outorga_pdf_url;}) || (usoBase && usoBase.outorga_pdf_url ? usoBase : null);
      return '<div style="background:'+cor.fundo+';border-left:4px solid '+cor.borda+';border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;">' +
        '<div style="font-size:22px;font-weight:800;color:'+cor.borda+';font-family:monospace;min-width:36px;text-align:center;">' + (idx+1) + '</div>' +
        '<div style="flex:1;">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
            '<span style="font-size:13px;font-weight:600;">' + (c?c.nome:'') + ' — ' + p.nome + '</span>' +
            '<span style="background:'+cor.borda+';color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">' + cor.label + '</span>' +
          '</div>' +
          '<div style="font-size:12px;color:var(--text-muted);display:flex;gap:16px;flex-wrap:wrap;">' +
            (portariaBase ? '<span>📋 Port. ' + portariaBase + '</span>' : '') +
            (processoBase ? '<span>📁 ' + processoBase + '</span>' : '') +
            '<span>📅 Vence: <strong style="color:'+cor.texto+'">' + venc.toLocaleDateString('pt-BR') + '</strong> (' + Math.max(0,x.dias) + ' dias)</span>' +
            '<span>💧 ' + uss.length + ' ponto(s)</span>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-direction:column;">' +
          (!x.renovando ? '<button class="btn btn-sm btn-amber" onclick="toggleRenovProp(\'' + p.id + '\',true)">Iniciar renovação</button>' : '<button class="btn btn-sm btn-blue" onclick="toggleRenovProp(\'' + p.id + '\',false)">Cancelar renovação</button>') +
          (usoComPdf ? '<a href="' + usoComPdf.outorga_pdf_url + '" target="_blank" class="btn btn-sm">📄 PDF</a>' : '') +
        '</div>' +
      '</div>';
    }).join('');
    el.innerHTML = diagHtml + listaHtml;
  }

  async function toggleRenovProp(pid, val) {
    // Atualiza todos os usos desta propriedade
    await api('usos?propriedade_id=eq.' + pid, 'PATCH', {renovacao_em_andamento: val}, 'return=minimal');
    await carregarDados();
  }

  // =============================================
  // EXCLUIR / DESATIVAR
  // =============================================
  async function desativarCliente(cid, nome) {
    if (!confirm('Desativar "' + nome + '"?')) return;
    await api('clientes?id=eq.' + cid, 'PATCH', {ativo: false}, 'return=minimal');
    carregarDados();
  }

  async function excluirCliente(cid, nome) {
    if (!confirm('ATENCAO! Excluir definitivamente "' + nome + '" e todos os seus dados? Esta acao e IRREVERSIVEL.')) return;
    if (!confirm('Confirmacao final: excluir "' + nome + '"?')) return;
    await api('clientes?id=eq.' + cid, 'DELETE', null, 'return=minimal');
    carregarDados();
    alert('Cliente excluido.');
  }

  async function excluirProp(pid, nome) {
    if (!confirm('Excluir a propriedade "' + nome + '" e todos os seus pontos? IRREVERSIVEL.')) return;
    await api('propriedades?id=eq.' + pid, 'DELETE', null, 'return=minimal');
    await carregarDados();
    if (clienteAtualId) verCliente(clienteAtualId);
  }

  async function excluirUso(uid, desc) {
    if (!confirm('Excluir o ponto "' + desc + '"? IRREVERSIVEL.')) return;
    await api('usos?id=eq.' + uid, 'DELETE', null, 'return=minimal');
    await carregarDados();
    if (clienteAtualId) verCliente(clienteAtualId);
  }


  // =============================================
  // DISPARO EM MASSA — LEITURA MENSAL
  // =============================================
  // Atualiza o card de Alertas mostrando QUE dia é hoje e qual disparo é o recomendado.
  // Também destaca o botão correto e desativa os outros se passou do dia 15.
  // dia: opcional, defaulta para hoje (usado em testes para simular outros dias)
  function atualizarStatusDisparoDia(diaForcado) {
    const status = document.getElementById('disparo-status-dia');
    if (!status) return;
    const dia = (typeof diaForcado === 'number') ? diaForcado : new Date().getDate();

    // Botões
    const b1 = document.getElementById('btn-disparo-1');
    const b5 = document.getElementById('btn-disparo-5');
    const b10 = document.getElementById('btn-disparo-10');
    [b1,b5,b10].forEach(function(b){ if(b) { b.style.opacity = '0.55'; b.style.outline = ''; b.disabled = false; } });

    let msg, cor;
    if (dia >= 1 && dia <= 3) {
      msg = '📅 Hoje é dia ' + dia + ' — momento ideal para o <strong>1º aviso</strong>.';
      cor = '#1565C0';
      if (b1) { b1.style.opacity = '1'; b1.style.outline = '3px solid #1565C0'; }
    } else if (dia >= 4 && dia <= 7) {
      msg = '📅 Hoje é dia ' + dia + ' — momento ideal para o <strong>lembrete (dia 5)</strong>.';
      cor = '#F9A825';
      if (b5) { b5.style.opacity = '1'; b5.style.outline = '3px solid #F9A825'; }
    } else if (dia >= 8 && dia <= 12) {
      msg = '📅 Hoje é dia ' + dia + ' — momento ideal para o <strong>alerta final (dia 10)</strong>.';
      cor = '#E65100';
      if (b10) { b10.style.opacity = '1'; b10.style.outline = '3px solid #E65100'; }
    } else if (dia >= 13 && dia <= 15) {
      msg = '⚠️ Hoje é dia ' + dia + ' — restam <strong>' + (15-dia) + ' dia(s)</strong> para o fim do prazo. Considere reenviar o alerta final.';
      cor = '#C62828';
      if (b10) { b10.style.opacity = '1'; b10.style.outline = '3px solid #E65100'; }
    } else {
      // Dia 16+: prazo encerrado
      msg = '🔒 Hoje é dia ' + dia + ' — <strong>prazo de leitura encerrado</strong>. Os clientes não conseguem mais enviar leitura deste mês pelo link. Lance manualmente em "Acompanhamento".';
      cor = '#C62828';
      [b1,b5,b10].forEach(function(b){ if(b) { b.style.opacity = '0.4'; b.disabled = true; } });
    }
    status.style.color = cor;
    status.innerHTML = msg;
  }

  async function dispararLeituraTodos(modo, diaForcado) {
    // Bloqueio: depois do dia 15, não dispara nada
    const dia = (typeof diaForcado === 'number') ? diaForcado : new Date().getDate();
    if (dia > 15) {
      alert('🔒 Não é possível disparar leituras após o dia 15.\n\n' +
            'O prazo do mês está encerrado. Os clientes não conseguem mais enviar leitura pelo link.\n\n' +
            'Para registrar uma leitura atrasada, use "Acompanhamento" → "+ Lançar leitura" (manualmente).');
      return;
    }

    const usosComH = usos.filter(function(u){ return u.possui_hidrometro && u.token; });
    const usosComL = new Set(leituras.map(function(l){ return l.uso_id; }));
    const pendentes = usosComH.filter(function(u){ return !usosComL.has(u.id); });

    if (!pendentes.length) { alert('✅ Todos os pontos já enviaram a leitura deste mês!'); return; }

    // Decide tom da mensagem por modo
    const cfg = {
      primeiro:    { titulo: '1º aviso',      icone: '📲', titMsg: 'Gestão da Água',         intro: 'Chegou o momento de registrar a leitura mensal do hidrômetro.' },
      lembrete5:   { titulo: 'Lembrete dia 5', icone: '🔔', titMsg: 'Lembrete de leitura',    intro: 'Sua leitura mensal ainda não foi registrada. Você tem até o dia 15 para enviar.' },
      lembrete10:  { titulo: 'Alerta dia 10',  icone: '⏰', titMsg: 'ATENÇÃO: prazo final',   intro: 'Sua leitura ainda não foi registrada. O prazo encerra no dia 15.' },
      // mantém compat com versão antiga
      lembrete:    { titulo: 'Lembrete',       icone: '⏰', titMsg: 'Lembrete de leitura',    intro: 'Sua leitura mensal ainda não foi registrada.' }
    }[modo] || { titulo: '1º aviso', icone: '📲', titMsg: 'Gestão da Água', intro: 'Chegou o momento de registrar a leitura mensal do hidrômetro.' };

    if (!confirm(cfg.icone + ' Enviar "' + cfg.titulo + '" para ' + pendentes.length + ' ponto(s) pendente(s)?\n\nSerão abertas ' + pendentes.length + ' janelas do WhatsApp em sequência.')) return;

    const status = document.getElementById('disparo-status');
    status.style.display = 'block';
    status.style.color = '#1565C0';
    let enviados = 0, semTel = 0;
    const diasRestantes = 15 - dia;

    pendentes.forEach(function(u, i) {
      const c = clientes.find(function(cc){ return cc.id === u.cliente_id; });
      const p = propriedades.find(function(pp){ return pp.id === u.propriedade_id; });
      if (!c) { semTel++; return; }
      const fone = (u.responsavel_tel || c.telefone1 || '').replace(/\D/g, '');
      if (!fone) { semTel++; return; }
      const req = u.requerimento ? '\n*Requerimento:* ' + u.requerimento : '';
      const ser = u.numero_serie ? '\n*Hidrômetro:* ' + u.numero_serie : '';
      const propNome = p ? p.nome : '';
      const linhaPrazo = diasRestantes > 0
        ? '\nVocê tem até o dia *15* para enviar (' + diasRestantes + ' dia(s) restante(s)).'
        : '\nO prazo encerra *hoje*. Envie agora.';
      const msg = encodeURIComponent(
        'Olá, ' + c.nome.split(' ')[0] + '!\n\n' +
        '*Zello Ambiental — ' + cfg.titMsg + '*\n' +
        cfg.intro + '\n\n' +
        '*Propriedade:* ' + propNome + '\n' +
        '*Ponto:* ' + u.descricao + req + ser + '\n' +
        (modo === 'primeiro' ? '' : linhaPrazo) + '\n\n' +
        'Acesse o link para informar a leitura:\n' +
        CLIENTE_URL + '?token=' + u.token + '\n\n' +
        'Em caso de dúvidas:\n' + EMPRESA.eng + ' · ' + EMPRESA.tel
      );
      setTimeout(function() {
        window.open('https://wa.me/55' + fone + '?text=' + msg, '_blank');
        enviados++;
        status.textContent = '📤 Enviando ' + cfg.titulo + '... ' + enviados + ' de ' + pendentes.length;
        if (enviados + semTel >= pendentes.length) {
          status.textContent = '✅ ' + cfg.titulo + ' enviado! ' + enviados + ' mensagem(ns)' + (semTel>0 ? ' · ' + semTel + ' sem telefone' : '') + '.';
          renderAlertas7dias();
        }
      }, i * 700);
    });
  }


  // =============================================
  // NOTIFICAÇÕES DE PROCESSOS
  // =============================================
  let notificacoes = [];
  let _notifFiltro = 'todas';

  async function carregarNotificacoes() {
    try {
      notificacoes = await api('notificacoes?select=*&order=prazo_resposta.asc') || [];
    } catch(e) { notificacoes = []; }
    renderNotificacoes();
    atualizarBadgeNotif();
  }

  function atualizarBadgeNotif() {
    const abertas = notificacoes.filter(function(n){ return n.status !== 'respondida'; });
    const badge = document.getElementById('badge-notif');
    if (badge) {
      badge.textContent = abertas.length > 0 ? abertas.length : '';
      badge.style.display = abertas.length > 0 ? 'inline-flex' : 'none';
      // Badge vermelho se alguma vence em 5 dias (ou já vencida)
      const criticas = abertas.filter(function(n){
        const dias = diasParaPrazo(n.prazo_resposta);
        return dias !== null && dias <= 5;
      });
      badge.style.background = criticas.length > 0 ? 'var(--red)' : 'var(--amber)';
    }
  }

  function diasParaPrazo(prazo) {
    if (!prazo) return null;
    var d = new Date(prazo+'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return Math.round((d - new Date()) / (1000*60*60*24));
  }

  function badgePrazo(dias, status) {
    if (status === 'respondida') return '<span style="background:#E8F5E9;color:#2E7D32;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:600;">✓ Respondida</span>';
    if (dias === null || dias === undefined || isNaN(dias)) return '<span style="background:#F3F4F6;color:#6B7280;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:600;">Sem prazo</span>';
    if (dias < 0) return '<span style="background:#FFEBEE;color:#C62828;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;">🔴 Vencida há '+Math.abs(dias)+' dia(s)</span>';
    if (dias <= 5) return '<span style="background:#FFEBEE;color:#C62828;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;">🔴 '+dias+' dia(s) restante(s)</span>';
    if (dias <= 10) return '<span style="background:#FFF3E0;color:#E65100;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;">🟠 '+dias+' dia(s) restante(s)</span>';
    return '<span style="background:#E8F5E9;color:#2E7D32;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:600;">🟢 '+dias+' dia(s) restante(s)</span>';
  }

  // Filtro de texto para a lista de notificações
  let _notifBuscaTexto = '';
  function buscarNotifs(q) {
    // Normaliza removendo acentos para a busca casar com tudo
    _notifBuscaTexto = (q || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
    renderNotificacoes();
  }

  function filtrarNotifs(filtro) {
    _notifFiltro = filtro;
    ['todas','abertas','em_andamento','respondidas'].forEach(function(f){
      const btn = document.getElementById('notif-filtro-'+f);
      if (btn) {
        btn.style.background = f===filtro?'#1565C0':'';
        btn.style.color = f===filtro?'white':'';
      }
    });
    renderNotificacoes();
  }

  function renderNotificacoes() {
    const el = document.getElementById('lista-notificacoes');
    if (!el) return;

    let lista = notificacoes;
    if (_notifFiltro === 'abertas') lista = lista.filter(function(n){ return n.status !== 'respondida'; });
    if (_notifFiltro === 'em_andamento') lista = lista.filter(function(n){ return n.status === 'em_andamento'; });
    if (_notifFiltro === 'respondidas') lista = lista.filter(function(n){ return n.status === 'respondida'; });

    // Filtro de texto: busca em cliente/órgão/processo/observação
    if (_notifBuscaTexto) {
      const q = _notifBuscaTexto;
      const norm = function(s){ return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); };
      lista = lista.filter(function(n){
        const c = clientes.find(function(cc){return cc.id===n.cliente_id;});
        const p = n.propriedade_id ? propriedades.find(function(pp){return pp.id===n.propriedade_id;}) : null;
        return norm(c ? c.nome : '').indexOf(q) >= 0
            || norm(p ? p.nome : '').indexOf(q) >= 0
            || norm(n.orgao).indexOf(q) >= 0
            || norm(n.tipo).indexOf(q) >= 0
            || norm(n.processo).indexOf(q) >= 0
            || norm(n.observacao).indexOf(q) >= 0;
      });
    }

    // Ordena por: 1) status (abertas primeiro), 2) prazo (mais urgente primeiro), null no final
    lista = lista.slice().sort(function(a,b){
      const aResp = a.status === 'respondida';
      const bResp = b.status === 'respondida';
      if (aResp !== bResp) return aResp ? 1 : -1;
      const da = diasParaPrazo(a.prazo_resposta);
      const db = diasParaPrazo(b.prazo_resposta);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
    });

    // Resumo
    const abertas = notificacoes.filter(function(n){ return n.status !== 'respondida'; }).length;
    const emAndamento = notificacoes.filter(function(n){ return n.status === 'em_andamento'; }).length;
    const criticas = notificacoes.filter(function(n){
      if (n.status === 'respondida') return false;
      const d = diasParaPrazo(n.prazo_resposta);
      return d !== null && d <= 5;
    }).length;
    const vencidas = notificacoes.filter(function(n){
      if (n.status === 'respondida') return false;
      const d = diasParaPrazo(n.prazo_resposta);
      return d !== null && d < 0;
    }).length;
    const resumoEl = document.getElementById('notif-resumo');
    if (resumoEl) {
      const partes = [];
      partes.push('<strong>'+abertas+'</strong> em aberto');
      if (emAndamento > 0) partes.push('<strong>'+emAndamento+'</strong> em andamento');
      if (criticas > 0) partes.push('<span style="color:#C62828;font-weight:700;">'+criticas+' crítica(s)</span>');
      if (vencidas > 0) partes.push('<span style="color:#C62828;font-weight:700;">'+vencidas+' vencida(s)</span>');
      resumoEl.innerHTML = partes.join(' · ');
    }

    if (!lista.length) {
      el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);font-size:13px;">'
        + (_notifBuscaTexto ? 'Nenhuma notificação corresponde à busca.' : 'Nenhuma notificação encontrada.')
        + '</div>';
      return;
    }

    const statusLabel = { aberta: 'Em aberto', em_andamento: 'Em andamento', respondida: 'Respondida' };

    el.innerHTML = lista.map(function(n) {
      const c = clientes.find(function(cc){ return cc.id === n.cliente_id; });
      const p = n.propriedade_id ? propriedades.find(function(pp){ return pp.id === n.propriedade_id; }) : null;
      const dias = diasParaPrazo(n.prazo_resposta);
      const prazoStr = n.prazo_resposta ? new Date(n.prazo_resposta+'T12:00:00').toLocaleDateString('pt-BR') : '—';
      const recebStr = n.data_recebimento ? new Date(n.data_recebimento+'T12:00:00').toLocaleDateString('pt-BR') : '—';
      const borderCor = n.status==='respondida' ? '#A5D6A7'
                      : n.status==='em_andamento' ? '#90CAF9'
                      : (dias !== null && dias <= 5) ? '#FECACA'
                      : (dias !== null && dias <= 10) ? '#FDBA74'
                      : '#BFDBFE';
      const corStatus = n.status==='respondida' ? '#2E7D32' : n.status==='em_andamento' ? '#1565C0' : '#E65100';
      const bgStatus  = n.status==='respondida' ? '#E8F5E9' : n.status==='em_andamento' ? '#E3F2FD' : '#FFF3E0';

      return '<div style="background:white;border:1px solid '+borderCor+';border-left:4px solid '+borderCor+';border-radius:8px;padding:14px 16px;margin-bottom:10px;">'
        +'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">'
          +'<div style="flex:1;">'
            +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">'
              +'<span style="background:#EFF6FF;color:#1565C0;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;">'+(n.orgao||'—')+'</span>'
              +'<span style="font-size:12px;font-weight:600;color:var(--text);">'+(n.tipo||'—')+'</span>'
              +badgePrazo(dias, n.status)
              +'<span style="background:'+bgStatus+';color:'+corStatus+';padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;">'+(statusLabel[n.status]||n.status)+'</span>'
            +'</div>'
            +'<div style="font-size:12px;font-weight:600;color:#1565C0;margin-bottom:3px;">'+(c?c.nome:'—')+(p?' · '+p.nome:'')+'</div>'
            +(n.processo?'<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">📋 '+n.processo+'</div>':'')
            +'<div style="font-size:12px;color:var(--text);line-height:1.6;background:#f9fafb;border-radius:6px;padding:8px 10px;margin-top:6px;">'+(n.observacao||'(sem descrição)')+'</div>'
            +'<div style="font-size:10px;color:var(--text-muted);margin-top:8px;">Recebido em '+recebStr+' · Prazo: <strong>'+prazoStr+'</strong></div>'
          +'</div>'
          +'<div style="display:flex;flex-direction:column;gap:6px;min-width:120px;">'
            +(n.status==='aberta' ? '<button class="btn btn-sm" style="background:#E3F2FD;color:#1565C0;border:1px solid #90CAF9;" onclick="marcarStatus(\''+n.id+'\',\'em_andamento\')">▶ Em andamento</button>' : '')
            +(n.status!=='respondida' ? '<button class="btn btn-sm" style="background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;" onclick="marcarStatus(\''+n.id+'\',\'respondida\')">✓ Respondida</button>' : '')
            +'<button class="btn btn-sm" onclick="editarNotif(\''+n.id+'\')">✏️ Editar</button>'
            +'<button class="btn btn-sm btn-danger" onclick="excluirNotif(\''+n.id+'\')">🗑 Excluir</button>'
          +'</div>'
        +'</div>'
      +'</div>';
    }).join('');
  }

  function abrirNovaNotif() {
    document.getElementById('notif-eid').value = '';
    document.getElementById('notif-modal-titulo').textContent = 'Nova notificação';
    // Preencher clientes
    const sel = document.getElementById('notif-cliente');
    sel.innerHTML = '<option value="">Selecionar cliente...</option>' +
      clientes.map(function(c){ return '<option value="'+c.id+'">'+c.nome+'</option>'; }).join('');
    document.getElementById('notif-prop').innerHTML = '<option value="">Todas as propriedades</option>';
    document.getElementById('notif-orgao').value = 'DAEE';
    document.getElementById('notif-tipo').value = 'Complementação de documentos';
    document.getElementById('notif-processo').value = '';
    document.getElementById('notif-obs').value = '';
    document.getElementById('notif-status').value = 'aberta';
    // Data recebimento = hoje
    const hoje = new Date().toISOString().slice(0,10);
    document.getElementById('notif-recebimento').value = hoje;
    document.getElementById('notif-prazo').value = '';
    abrirModal('ov-notif');
  }

  function notifPopularProps() {
    const cid = document.getElementById('notif-cliente').value;
    const sel = document.getElementById('notif-prop');
    sel.innerHTML = '<option value="">Todas as propriedades</option>';
    if (!cid) return;
    const props = propriedades.filter(function(p){ return p.cliente_id === cid; });
    props.forEach(function(p){ sel.innerHTML += '<option value="'+p.id+'">'+p.nome+'</option>'; });
  }

  function editarNotif(nid) {
    const n = notificacoes.find(function(nn){ return nn.id === nid; });
    if (!n) return;
    document.getElementById('notif-eid').value = nid;
    document.getElementById('notif-modal-titulo').textContent = 'Editar notificação';
    const sel = document.getElementById('notif-cliente');
    sel.innerHTML = '<option value="">Selecionar cliente...</option>' +
      clientes.map(function(c){ return '<option value="'+c.id+'">'+c.nome+'</option>'; }).join('');
    sel.value = n.cliente_id || '';
    notifPopularProps();
    document.getElementById('notif-prop').value = n.propriedade_id || '';
    document.getElementById('notif-orgao').value = n.orgao || 'DAEE';
    document.getElementById('notif-tipo').value = n.tipo || '';
    document.getElementById('notif-processo').value = n.processo || '';
    document.getElementById('notif-obs').value = n.observacao || '';
    document.getElementById('notif-status').value = n.status || 'aberta';
    document.getElementById('notif-recebimento').value = n.data_recebimento || '';
    document.getElementById('notif-prazo').value = n.prazo_resposta || '';
    abrirModal('ov-notif');
  }

  async function salvarNotif() {
    const eid = document.getElementById('notif-eid').value;
    const cid = document.getElementById('notif-cliente').value;
    const obs = document.getElementById('notif-obs').value.trim();
    const prazo = document.getElementById('notif-prazo').value;
    const receb = document.getElementById('notif-recebimento').value;
    const processo = document.getElementById('notif-processo').value.trim();
    if (!cid) { alert('Selecione o cliente.'); return; }
    if (!obs) { alert('Preencha as observações.'); return; }
    if (!receb) { alert('Informe a data de recebimento.'); return; }
    if (!prazo) { alert('Informe o prazo para resposta.'); return; }

    // Validação: prazo não pode ser anterior à data de recebimento
    if (prazo < receb) {
      alert('⚠️ O prazo de resposta não pode ser anterior à data de recebimento.');
      return;
    }

    // Validação: data de recebimento não pode ser muito no futuro (>30 dias à frente é provavelmente erro de digitação)
    var hoje = new Date(); hoje.setHours(0,0,0,0);
    var dReceb = new Date(receb+'T12:00:00');
    var diffFuturo = (dReceb - hoje)/(1000*60*60*24);
    if (diffFuturo > 30) {
      if (!confirm('⚠️ A data de recebimento está mais de 30 dias no futuro (' + new Date(receb+'T12:00:00').toLocaleDateString('pt-BR') + '). Confirmar mesmo assim?')) return;
    }

    // Validação: notificação duplicada (mesmo cliente + mesmo processo, ignorando a própria em edição)
    if (processo) {
      var dup = notificacoes.find(function(nn){
        if (eid && nn.id === eid) return false;
        return nn.cliente_id === cid && nn.processo && nn.processo.trim().toLowerCase() === processo.toLowerCase();
      });
      if (dup) {
        var c = clientes.find(function(cc){return cc.id===cid;});
        if (!confirm('⚠️ Já existe uma notificação para "' + (c?c.nome:'este cliente') + '" com o mesmo processo "' + processo + '".\n\nSalvar mesmo assim?')) return;
      }
    }

    const payload = {
      cliente_id: cid,
      propriedade_id: document.getElementById('notif-prop').value || null,
      orgao: document.getElementById('notif-orgao').value,
      tipo: document.getElementById('notif-tipo').value,
      processo: processo || null,
      observacao: obs,
      data_recebimento: receb,
      prazo_resposta: prazo,
      status: document.getElementById('notif-status').value
    };

    let r;
    if (eid) {
      r = await api('notificacoes?id=eq.'+eid, 'PATCH', payload, 'return=minimal');
    } else {
      r = await api('notificacoes', 'POST', payload, 'return=minimal');
    }

    if (r && r.ok) {
      fecharModal('ov-notif');
      await carregarNotificacoes();
    } else {
      var errMsg = '';
      if (r) { try { errMsg = await r.text(); } catch(e) {} }
      console.error('[Zello] Erro salvarNotif:', errMsg);
      alert('Erro ao salvar notificação.' + (errMsg ? '\n\n' + errMsg.substring(0,200) : ''));
    }
  }

  async function marcarStatus(nid, novoStatus) {
    const labels = { aberta: 'em aberto', em_andamento: 'em andamento', respondida: 'respondida' };
    if (!confirm('Marcar esta notificação como ' + (labels[novoStatus] || novoStatus) + '?')) return;
    const r = await api('notificacoes?id=eq.'+nid, 'PATCH', { status: novoStatus }, 'return=minimal');
    if (r && r.ok) {
      await carregarNotificacoes();
    } else {
      alert('Erro ao atualizar status da notificação.');
    }
  }
  // Compatibilidade — mantém funcionando código antigo que chamasse marcarRespondida
  async function marcarRespondida(nid) { return marcarStatus(nid, 'respondida'); }

  async function excluirNotif(nid) {
    if (!confirm('Excluir esta notificação? Esta ação não pode ser desfeita.')) return;
    await api('notificacoes?id=eq.'+nid, 'DELETE', null, 'return=minimal');
    await carregarNotificacoes();
  }

  // =============================================
  // COMUNICADOS
  // =============================================
  // =============================================
  // COMUNICADOS
  // =============================================

  // Templates pré-prontos. {nome}, {empreendimento}, {ponto}, {requerimento}, {portaria} são substituídos por cliente.
  const TEMPLATES_COMUNICADO = {
    lembrete_leitura: {
      titulo: 'Lembrete de leitura mensal',
      msg: 'Olá, {nome}!\n\nGostaríamos de lembrar que ainda não recebemos a leitura mensal do hidrômetro do seu empreendimento *{empreendimento}*.\n\nPedimos a gentileza de enviar o quanto antes pelo link enviado anteriormente. O prazo encerra no *dia 15* deste mês.\n\nQualquer dúvida estamos à disposição.'
    },
    renovacao: {
      titulo: 'Início do processo de renovação de outorga',
      msg: 'Prezado(a) {nome},\n\nA outorga do empreendimento *{empreendimento}* (Portaria {portaria}) está se aproximando do vencimento.\n\nIniciaremos o processo de renovação. Para isso, precisaremos:\n• Documentação atualizada do imóvel\n• Cadastro Ambiental Rural (CAR)\n• Comprovantes de envio mensal de leituras dos últimos 12 meses\n\nEntraremos em contato em breve para alinhamento. Por favor, mantenha esta documentação à mão.'
    },
    vistoria: {
      titulo: 'Aviso de possível vistoria do órgão ambiental',
      msg: 'Prezado(a) {nome},\n\nInformamos que o órgão ambiental pode realizar vistoria no empreendimento *{empreendimento}* nos próximos dias.\n\nRecomendamos:\n• Manter o hidrômetro em local visível e acessível\n• Verificar se a placa de identificação da outorga está visível\n• Manter a área da captação limpa e organizada\n• Ter cópia da outorga e comprovantes de leituras disponíveis\n\nQualquer notificação que receba do órgão, nos avise imediatamente.'
    },
    manutencao_hidrometro: {
      titulo: 'Manutenção / troca de hidrômetro',
      msg: 'Olá, {nome}!\n\nIdentificamos que o hidrômetro do ponto *{ponto}* (empreendimento {empreendimento}) precisa de manutenção ou substituição.\n\nPor favor, entre em contato para agendarmos a vistoria técnica. É importante registrar a leitura final do equipamento atual antes da troca, para manter o histórico contínuo.'
    },
    excesso_consumo: {
      titulo: 'Alerta: consumo acima do autorizado',
      msg: 'Prezado(a) {nome},\n\nIdentificamos que o consumo de água no ponto *{ponto}* do empreendimento *{empreendimento}* superou o volume autorizado pela outorga nos últimos meses.\n\nÉ importante revisar o uso e adequar ao limite autorizado, pois consumos persistentes acima do autorizado podem gerar:\n• Notificação do órgão ambiental\n• Multa\n• Suspensão da outorga\n\nVamos agendar uma reunião técnica para avaliar as alternativas?'
    },
    documentacao: {
      titulo: 'Solicitação de documentação',
      msg: 'Prezado(a) {nome},\n\nPara dar continuidade aos serviços de assessoria ambiental do empreendimento *{empreendimento}*, precisamos dos seguintes documentos atualizados:\n\n• Documento pessoal (CPF/RG ou CNPJ + contrato social)\n• Matrícula atualizada do imóvel\n• CAR (Cadastro Ambiental Rural)\n• ITR (Imposto Territorial Rural) do último ano\n\nPode enviar pelo WhatsApp ou e-mail. Obrigado!'
    },
    boas_festas: {
      titulo: 'Boas festas',
      msg: 'Olá, {nome}!\n\nA equipe da Zello Ambiental deseja a você e sua família boas festas e um ano novo cheio de realizações.\n\nNosso compromisso com a gestão sustentável da água do seu empreendimento continua em 2026. Estamos à disposição.\n\nGrande abraço!'
    },
    reuniao: {
      titulo: 'Convite para reunião técnica',
      msg: 'Prezado(a) {nome},\n\nGostaria de agendar uma reunião técnica para discutirmos as próximas etapas do processo ambiental do empreendimento *{empreendimento}*.\n\nTemos disponibilidade para presencial ou videochamada. Quando seria melhor para você?'
    }
  };

  function aplicarTemplateComunicado(key) {
    if (!key) return;
    const t = TEMPLATES_COMUNICADO[key];
    if (!t) return;
    document.getElementById('com-titulo').value = t.titulo;
    document.getElementById('com-msg').value = t.msg;
    atualizarPreviewComunicado();
  }

  function getDestinatariosComunicado() {
    const tipo = document.getElementById('com-dest').value;
    const ativos = clientes.filter(function(c){ return c.ativo !== false && c.telefone1; });
    if (tipo === 'todos') return ativos;
    if (tipo === 'cliente_unico') {
      const cid = document.getElementById('com-cliente').value;
      return cid ? ativos.filter(function(c){ return c.id === cid; }) : [];
    }
    if (tipo === 'com_hidrometro') {
      const cidsComH = new Set(usos.filter(function(u){ return u.possui_hidrometro; }).map(function(u){ return u.cliente_id; }));
      return ativos.filter(function(c){ return cidsComH.has(c.id); });
    }
    if (tipo === 'sem_leitura_mes') {
      const usosComH = usos.filter(function(u){ return u.possui_hidrometro; });
      const usosComL = new Set((leituras || []).map(function(l){ return l.uso_id; }));
      const cidsPendentes = new Set(usosComH.filter(function(u){ return !usosComL.has(u.id); }).map(function(u){ return u.cliente_id; }));
      return ativos.filter(function(c){ return cidsPendentes.has(c.id); });
    }
    if (tipo === 'com_outorga_proxima') {
      const cidsVenc = new Set(propriedades.filter(function(p){
        const d = getDiasVenc(p);
        return d !== null && d/30 <= 6;
      }).map(function(p){ return p.cliente_id; }));
      return ativos.filter(function(c){ return cidsVenc.has(c.id); });
    }
    return [];
  }

  function atualizarContagemDestinatarios() {
    const tipo = document.getElementById('com-dest').value;
    const wrap = document.getElementById('com-cliente-wrap');
    const sel = document.getElementById('com-cliente');
    if (tipo === 'cliente_unico') {
      wrap.style.display = '';
      sel.innerHTML = '<option value="">Selecionar...</option>' +
        clientes.filter(function(c){ return c.ativo !== false; })
          .map(function(c){ return '<option value="'+c.id+'">'+c.nome+'</option>'; }).join('');
    } else {
      wrap.style.display = 'none';
    }
    const dests = getDestinatariosComunicado();
    const el = document.getElementById('com-contagem');
    if (!dests.length) {
      el.innerHTML = '<span style="color:#C62828;">⚠ Nenhum destinatário corresponde ao filtro atual.</span>';
    } else {
      el.innerHTML = '📤 Será enviado para <strong>' + dests.length + '</strong> cliente(s).';
    }
    atualizarPreviewComunicado();
  }

  function montarMensagemComunicado(c, titulo, msgBase) {
    // Para usar primeira propriedade/uso quando relevante
    const p = propriedades.find(function(pp){ return pp.cliente_id === c.id; });
    const u = p ? usos.find(function(uu){ return uu.propriedade_id === p.id; }) : null;
    const subs = {
      '{nome}': (c.nome || '').split(' ')[0],
      '{empreendimento}': p ? p.nome : '',
      '{ponto}': u ? (u.descricao || '') : '',
      '{requerimento}': u && u.requerimento ? u.requerimento : '',
      '{portaria}': (u && u.portaria) || (p && p.portaria) || ''
    };
    let texto = msgBase;
    Object.keys(subs).forEach(function(k){ texto = texto.split(k).join(subs[k]); });
    // remove linhas que ficaram com "*  *" (vazio entre asteriscos) ou ficaram só com pontuação
    texto = texto.replace(/\*\s*\*/g, '').replace(/\(\s*\)/g, '');
    return '*' + titulo + '*\n\n' + texto + '\n\n— ' + EMPRESA.nome + '\n' + EMPRESA.eng + ' · ' + EMPRESA.tel;
  }

  function atualizarPreviewComunicado() {
    const titulo = document.getElementById('com-titulo').value.trim();
    const msg = document.getElementById('com-msg').value.trim();
    const el = document.getElementById('com-preview');
    if (!titulo && !msg) {
      el.innerHTML = '<em>O preview aparece aqui conforme você digita.</em>';
      el.style.color = 'var(--text-muted)';
      return;
    }
    const dests = getDestinatariosComunicado();
    const cliente = dests[0] || clientes[0] || { nome: 'João Cliente' };
    const tit = titulo || '(sem título)';
    const corpo = msg || '(sem mensagem)';
    const exemplo = montarMensagemComunicado(cliente, tit, corpo);
    el.style.color = 'var(--text)';
    el.textContent = exemplo + '\n\n— Preview baseado em: ' + (cliente.nome || '');
  }

  function visualizarComunicado() {
    atualizarPreviewComunicado();
    const dests = getDestinatariosComunicado();
    if (!dests.length) {
      alert('⚠ Não há destinatários com este filtro.\n\nVerifique o telefone cadastrado dos clientes ou troque o filtro.');
      return;
    }
    alert('👁 Preview atualizado.\n\n' + dests.length + ' cliente(s) receberão esta mensagem com seu nome substituído.');
  }

  function enviarComunicado() {
    const titulo = document.getElementById('com-titulo').value.trim();
    const msg = document.getElementById('com-msg').value.trim();
    if (!titulo) { alert('Preencha o título.'); return; }
    if (!msg) { alert('Preencha a mensagem.'); return; }

    const dests = getDestinatariosComunicado();
    if (!dests.length) {
      alert('⚠ Nenhum destinatário com este filtro.\n\nVerifique se há clientes cadastrados com telefone, ou troque o tipo de destinatário.');
      return;
    }

    if (!confirm('📤 Enviar comunicado para ' + dests.length + ' cliente(s)?\n\nSerão abertas ' + dests.length + ' janelas do WhatsApp em sequência (uma a cada 0,7s).\n\nLembre-se de permitir popups neste site.')) return;

    const status = document.getElementById('com-status');
    status.style.display = 'block';
    status.style.background = '#E3F2FD';
    status.style.borderColor = '#90CAF9';
    status.style.color = '#1565C0';

    let enviados = 0;
    dests.forEach(function(c, i) {
      const fone = (c.telefone1||'').replace(/\D/g,'');
      const txt = encodeURIComponent(montarMensagemComunicado(c, titulo, msg));
      setTimeout(function() {
        window.open('https://wa.me/55' + fone + '?text=' + txt, '_blank');
        enviados++;
        if (enviados < dests.length) {
          status.innerHTML = '📤 Enviando... <strong>' + enviados + '</strong> de ' + dests.length + ' (' + c.nome + ')';
        } else {
          status.style.background = '#E8F5E9';
          status.style.borderColor = '#A5D6A7';
          status.style.color = '#2E7D32';
          status.innerHTML = '✅ <strong>Comunicado enviado!</strong> ' + dests.length + ' janelas do WhatsApp foram abertas. Confirme o envio em cada uma.';
        }
      }, i * 700);
    });
  }

  // =============================================
  // LEITURAS
  // =============================================
  async function carregarLeituras() {
    const mes = document.getElementById('filtro-mes').value || getMes();
    const cid = document.getElementById('filtro-cli').value;
    let url = 'leituras?mes_referencia=eq.' + mes + '&select=*&order=enviado_em.desc';
    if (cid) url += '&cliente_id=eq.' + cid;
    const data = await api(url) || [];
    const tbody = document.getElementById('tbl-leituras');
    const resumoEl = document.getElementById('leituras-resumo');

    if (!data.length) {
      if (resumoEl) resumoEl.innerHTML = 'Nenhuma leitura encontrada para o mês <strong>' + mes + '</strong>.';
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:20px;color:var(--text-muted)">Nenhuma leitura encontrada</td></tr>';
      return;
    }

    // Totalizadores
    let totalConsumo = 0, totalAcima = 0, totalAutorizado = 0;
    data.forEach(function(l){
      const u = usos.find(function(uu){return uu.id===l.uso_id;});
      const aut = u ? getAutorizadoUso(u) : 0;
      totalConsumo += (l.consumo_m3 || 0);
      totalAutorizado += aut;
      if (aut > 0 && (l.consumo_m3||0) > aut) totalAcima++;
    });
    if (resumoEl) {
      resumoEl.innerHTML = '📊 <strong>' + data.length + '</strong> leitura(s) · '
        + '<strong>' + totalConsumo.toFixed(1) + ' m³</strong> captados · '
        + (totalAutorizado > 0 ? '<strong>' + totalAutorizado.toFixed(1) + ' m³</strong> autorizados · ' : '')
        + (totalAcima > 0 ? '<span style="color:#C62828;font-weight:700;">' + totalAcima + ' acima do limite ⚠</span>' : '<span style="color:#2E7D32;">todas dentro do limite ✓</span>');
    }

    tbody.innerHTML = data.map(function(l) {
      const c = clientes.find(function(cc){return cc.id===l.cliente_id;});
      const u = usos.find(function(uu){return uu.id===l.uso_id;});
      const p = u ? propriedades.find(function(pp){return pp.id===u.propriedade_id;}) : null;
      const aut = u ? getAutorizadoUso(u) : 0;
      const acima = aut > 0 && (l.consumo_m3||0) > aut;
      const dataStr = l.enviado_em ? new Date(l.enviado_em).toLocaleDateString('pt-BR') : '—';
      const fotoIcon = l.foto_equipamento_url
        ? '<a href="' + l.foto_equipamento_url + '" target="_blank" rel="noopener" title="Ver foto enviada pelo cliente" style="text-decoration:none;margin-left:4px;">📷</a>'
        : '';
      return '<tr>' +
        '<td style="font-size:11px">' + dataStr + fotoIcon + '</td>' +
        '<td style="font-weight:500">' + (c?c.nome:'—') + '</td>' +
        '<td style="font-size:11px">' + (p?p.nome:'—') + '</td>' +
        '<td style="font-size:11px">' + (u?u.descricao:'—') + '</td>' +
        '<td style="font-family:monospace">' + (l.leitura_anterior||0) + '</td>' +
        '<td style="font-family:monospace">' + (l.leitura_atual||0) + '</td>' +
        '<td style="' + (acima?'color:var(--red);font-weight:600':'') + '">' + ((l.consumo_m3||0).toFixed(1)) + (acima?' ⚠':'') + '</td>' +
        '<td>' + (aut>0?aut.toFixed(1):'—') + '</td>' +
        '<td><span class="badge ' + (acima?'badge-late':'badge-ok') + '">' + (acima?'Acima':'Normal') + '</span></td>' +
        '<td><div style="display:flex;gap:3px;">' +
          '<button class="btn btn-sm" onclick="editarLeitura(\''+l.id+'\')" title="Editar">✏️</button>' +
          '<button class="btn btn-sm btn-danger" onclick="excluirLeitura(\''+l.id+'\')" title="Excluir">🗑</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
  }

  async function editarLeitura(lid) {
    const lAll = await api('leituras?id=eq.' + lid + '&select=*') || [];
    if (!lAll.length) { alert('Leitura não encontrada.'); return; }
    const l = lAll[0];
    const u = usos.find(function(uu){return uu.id===l.uso_id;});
    if (!u) { alert('Ponto da leitura não encontrado.'); return; }

    const novoAtu = prompt('Editar leitura ATUAL para o ponto "' + u.descricao + '" no mês ' + l.mes_referencia + ':\n\n' +
      'Leitura anterior: ' + (l.leitura_anterior || 0) + '\n' +
      'Leitura atual atualmente: ' + (l.leitura_atual || 0) + '\n\n' +
      'Nova leitura atual:', String(l.leitura_atual || 0));
    if (novoAtu === null) return;
    const lAtu = parseFloat(novoAtu);
    if (isNaN(lAtu)) { alert('Valor inválido.'); return; }
    if (lAtu < (l.leitura_anterior || 0)) { alert('A leitura atual não pode ser menor que a anterior (' + (l.leitura_anterior || 0) + ').'); return; }
    const consumo = lAtu - (l.leitura_anterior || 0);

    const r = await api('leituras?id=eq.' + lid, 'PATCH', {
      leitura_atual: lAtu,
      consumo_m3: consumo
    }, 'return=minimal');
    if (r && r.ok) {
      await carregarLeituras();
      alert('✅ Leitura atualizada. Novo consumo: ' + consumo.toFixed(1) + ' m³');
    } else {
      var errMsg = '';
      if (r) { try { errMsg = await r.text(); } catch(e) {} }
      alert('Erro ao atualizar leitura.' + (errMsg ? '\n\n' + errMsg.substring(0,200) : ''));
    }
  }

  async function excluirLeitura(lid) {
    if (!confirm('🗑 Excluir esta leitura?\n\nEsta ação NÃO pode ser desfeita.\n\nProsseguir?')) return;
    const r = await api('leituras?id=eq.' + lid, 'DELETE', null, 'return=minimal');
    if (r && r.ok) {
      await carregarLeituras();
    } else {
      alert('Erro ao excluir leitura.');
    }
  }

  function exportarLeiturasMes() {
    const mes = document.getElementById('filtro-mes').value || getMes();
    if (typeof XLSX === 'undefined') { alert('Aguarde a biblioteca de Excel carregar.'); return; }
    const tbody = document.getElementById('tbl-leituras');
    const tabela = tbody.closest('table');
    if (!tabela || !tbody.rows.length) { alert('Nenhuma leitura para exportar.'); return; }
    // Constrói CSV/XLSX a partir dos dados visíveis (que estão em `data` da última carga)
    // Mais simples: chama carregar leituras e exporta o resultado
    const ws = XLSX.utils.aoa_to_sheet([
      ['Data','Cliente','Propriedade','Ponto','Leit. anterior','Leit. atual','Consumo m³','Autorizado','Status']
    ]);
    const linhas = [];
    Array.from(tbody.rows).forEach(function(tr){
      if (tr.cells.length < 9) return;
      linhas.push(Array.from(tr.cells).slice(0,9).map(function(td){ return td.textContent.trim(); }));
    });
    XLSX.utils.sheet_add_aoa(ws, linhas, {origin: 'A2'});
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leituras ' + mes);
    XLSX.writeFile(wb, 'Zello_Leituras_' + mes + '.xlsx');
  }

  // =============================================
  // RELATÓRIOS (cascata: Cliente → Prop → Uso)
  // =============================================
  function popularSelectsRel() {
    // Preencher ano atual se ainda não preenchido
    const anoInput = document.getElementById('rel-ano');
    if (anoInput && !anoInput.value) anoInput.value = new Date().getFullYear();
    const s = document.getElementById('rel-cliente');
    if (!s) return;
    const v = s.value;
    s.innerHTML = '<option value="">Selecione o cliente</option>';
    clientes.forEach(function(c){ const o = document.createElement('option'); o.value=c.id; o.textContent=c.nome; s.appendChild(o); });
    s.value = v;
    const sf = document.getElementById('filtro-cli');
    if (sf) { const vf=sf.value; sf.innerHTML='<option value="">Todos</option>'; clientes.forEach(function(c){const o=document.createElement('option');o.value=c.id;o.textContent=c.nome;sf.appendChild(o);}); sf.value=vf; }
  }

  function carregarPropRel() {
    const cid = document.getElementById('rel-cliente').value;
    const s = document.getElementById('rel-prop');
    s.innerHTML = '<option value="">Selecione a propriedade</option>';
    document.getElementById('rel-uso').innerHTML = '<option value="">Selecione o ponto</option>';
    if (!cid) return;
    propriedades.filter(function(p){return p.cliente_id===cid;}).forEach(function(p){ const o=document.createElement('option');o.value=p.id;o.textContent=p.nome;s.appendChild(o); });
  }

  function carregarUsoRel() {
    const pid = document.getElementById('rel-prop').value;
    const s = document.getElementById('rel-uso');
    s.innerHTML = '<option value="">Selecione o ponto</option>';
    if (!pid) return;
    usos.filter(function(u){return u.propriedade_id===pid;}).forEach(function(u){ const o=document.createElement('option');o.value=u.id;o.textContent=u.descricao+(u.numero_serie?' ('+u.numero_serie+')':'');s.appendChild(o); });
  }

  async function gerarRelatorio() {
    const cid = document.getElementById('rel-cliente').value;
    const pid = document.getElementById('rel-prop').value;
    const uid = document.getElementById('rel-uso').value;
    const ano = document.getElementById('rel-ano').value || new Date().getFullYear();
    if (!cid||!pid||!uid||!ano) { alert('Selecione cliente, propriedade, ponto e ano.'); return; }
    const c = clientes.find(function(cc){return cc.id===cid;});
    const p = propriedades.find(function(pp){return pp.id===pid;});
    const u = usos.find(function(uu){return uu.id===uid;});
    if (!c || !p || !u) { alert('Erro: dados não encontrados.'); return; }

    const leitsAno = await api('leituras?uso_id=eq.'+uid+'&mes_referencia=gte.'+ano+'-01&mes_referencia=lte.'+ano+'-12&select=*&order=mes_referencia.asc') || [];
    const dadosMeses = ['01','02','03','04','05','06','07','08','09','10','11','12'].map(function(m){
      const found = leitsAno.filter(function(l){return l.mes_referencia===ano+'-'+m;});
      return found.length ? found[0] : null;
    });

    const aut = getAutorizadoUso(u);
    const autAnual = aut * 12;
    const nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const totalCap = dadosMeses.reduce(function(s,l){return s+(l?l.consumo_m3||0:0);},0);
    const pct = autAnual > 0 ? Math.round(totalCap/autAnual*100) : 0;
    const mesesComDado = dadosMeses.filter(function(l){return l;}).length;
    const mesesAcima = dadosMeses.filter(function(l){return l&&aut>0&&l.consumo_m3>aut;}).length;
    const mesesSemDado = 12 - mesesComDado;

    // Vencimento — usar dados do USO (etapa 3), com fallback para propriedade
    let vencBadge = '';
    let vencInfo = '';
    let dataEmissaoStr = '';
    let dataVencStr = '';
    const dataEm = u.data_emissao || p.data_emissao;
    const prazoAn = u.prazo_anos || p.prazo_anos;
    if (dataEm && prazoAn) {
      const dEm = new Date(dataEm);
      dataEmissaoStr = dEm.toLocaleDateString('pt-BR');
      const dVenc = new Date(dataEm); dVenc.setFullYear(dVenc.getFullYear()+parseInt(prazoAn,10));
      const dias = Math.round((dVenc-new Date())/(1000*60*60*24));
      dataVencStr = dVenc.toLocaleDateString('pt-BR');
      const cor = dias<0?'#C62828':dias<90?'#E65100':'#15803D';
      const bg = dias<0?'#FFEBEE':dias<90?'#FFF3E0':'#F0FDF4';
      const label = dias<0?'VENCIDA em '+dataVencStr:dias<90?'Vence em '+dataVencStr+' ('+dias+'d)':'Válida até '+dataVencStr;
      vencBadge = '<span style="background:'+bg+';color:'+cor+';padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">'+label+'</span>';
      vencInfo = label;
    }

    // Mapa dos tipos de outorga
    const tiposOutorga = { outorga: 'Outorga', dispensa: 'Dispensa de Outorga', tamponamento: 'Tamponamento e Desistência' };
    const tipoOutorgaTxt = tiposOutorga[u.tipo_outorga] || u.tipo_outorga || 'Outorga';

    // Responsável pela leitura
    let respLeituraTxt = '—';
    if (u.responsavel_tel) {
      // Busca o nome correspondente ao telefone
      const cli = clientes.find(function(cc){ return cc.id===u.cliente_id; });
      const ctsAll = contatos.filter(function(ct){ return ct.cliente_id===u.cliente_id; });
      let respNome = '';
      if (cli && cli.telefone1 === u.responsavel_tel) respNome = cli.nome + ' (titular)';
      else {
        const ctMatch = ctsAll.find(function(ct){ return ct.telefone === u.responsavel_tel; });
        if (ctMatch) respNome = ctMatch.nome + ' (' + ctMatch.papel + ')';
      }
      respLeituraTxt = (respNome ? respNome + ' · ' : '') + u.responsavel_tel;
    }

    // ============================================
    // GRÁFICO SVG — meses bem visíveis, eixo Y, grid
    // ============================================
    const vals = dadosMeses.map(function(l){return l?l.consumo_m3||0:0;});
    const maxVal = Math.max.apply(null, vals.concat([aut||1, 1]));
    // Arredondar maxVal para escala bonita
    const escalaY = Math.ceil(maxVal * 1.1 / 10) * 10;
    const svgW = 820;
    const svgH = 240;          // altura maior pra caber labels
    const padTop = 18;
    const padBottom = 38;      // mais espaço pra labels dos meses
    const padLeft = 50;        // espaço pro eixo Y
    const padRight = 20;
    const plotW = svgW - padLeft - padRight;
    const plotH = svgH - padTop - padBottom;
    const barUnit = plotW / 12;
    const barW = Math.floor(barUnit * 0.62);

    // Linhas de grade horizontais (4 linhas)
    let grid = '';
    let yLabels = '';
    for (let g = 0; g <= 4; g++) {
      const yVal = (escalaY * g / 4);
      const yPx = padTop + plotH - (yVal / escalaY) * plotH;
      grid += '<line x1="'+padLeft+'" y1="'+yPx+'" x2="'+(svgW-padRight)+'" y2="'+yPx+'" stroke="#e5e7eb" stroke-width="0.8" stroke-dasharray="2,3"/>';
      yLabels += '<text x="'+(padLeft-6)+'" y="'+(yPx+3)+'" text-anchor="end" font-size="9" fill="#6b7280">'+yVal.toFixed(0)+'</text>';
    }

    // Barras
    const svgBars = dadosMeses.map(function(l, i){
      const v = l ? l.consumo_m3||0 : 0;
      const acima = aut > 0 && v > aut;
      const cor = !l ? '#d1d5db' : acima ? '#C62828' : '#1976D2';
      const h = v > 0 ? Math.max(Math.round(v/escalaY * plotH), 3) : 0;
      const x = padLeft + i*barUnit + (barUnit-barW)/2;
      const yBar = padTop + plotH - h;
      let svg = '<g>';
      svg += '<rect x="'+x.toFixed(1)+'" y="'+yBar+'" width="'+barW+'" height="'+h+'" fill="'+cor+'" rx="2"/>';
      // Valor em cima da barra
      if (v > 0) {
        svg += '<text x="'+(x+barW/2).toFixed(1)+'" y="'+(yBar-3)+'" text-anchor="middle" font-size="10" fill="'+cor+'" font-weight="700">'+v.toFixed(0)+'</text>';
      }
      // Nome do mês embaixo (FONTE MAIOR)
      svg += '<text x="'+(x+barW/2).toFixed(1)+'" y="'+(padTop+plotH+15)+'" text-anchor="middle" font-size="11" fill="#374151" font-weight="600">'+nomeMeses[i]+'</text>';
      // Status do mês (Acima/—) embaixo do nome
      if (l) {
        svg += '<text x="'+(x+barW/2).toFixed(1)+'" y="'+(padTop+plotH+27)+'" text-anchor="middle" font-size="8" fill="'+(acima?'#C62828':'#15803D')+'">'+(acima?'⚠':'✓')+'</text>';
      } else {
        svg += '<text x="'+(x+barW/2).toFixed(1)+'" y="'+(padTop+plotH+27)+'" text-anchor="middle" font-size="8" fill="#9ca3af">—</text>';
      }
      svg += '</g>';
      return svg;
    }).join('');

    // Linha do limite (vazão autorizada)
    let limLine = '';
    if (aut > 0 && aut <= escalaY) {
      const yLim = padTop + plotH - (aut/escalaY) * plotH;
      limLine = '<line x1="'+padLeft+'" y1="'+yLim+'" x2="'+(svgW-padRight)+'" y2="'+yLim+'" stroke="#E65100" stroke-width="1.5" stroke-dasharray="6,3"/>'
              + '<text x="'+(svgW-padRight-2)+'" y="'+(yLim-3)+'" text-anchor="end" font-size="9" fill="#E65100" font-weight="700">Limite '+aut.toFixed(0)+' m³/mês</text>';
    }
    // Eixo Y / X (linhas)
    const eixos = '<line x1="'+padLeft+'" y1="'+padTop+'" x2="'+padLeft+'" y2="'+(padTop+plotH)+'" stroke="#374151" stroke-width="1"/>'
                + '<line x1="'+padLeft+'" y1="'+(padTop+plotH)+'" x2="'+(svgW-padRight)+'" y2="'+(padTop+plotH)+'" stroke="#374151" stroke-width="1"/>'
                + '<text x="'+(padLeft-44)+'" y="'+(padTop+plotH/2)+'" font-size="9" fill="#6b7280" transform="rotate(-90 '+(padLeft-44)+' '+(padTop+plotH/2)+')" text-anchor="middle" font-weight="600">m³ / mês</text>';

    const svgGraf = '<svg width="'+svgW+'" height="'+svgH+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">'
      + grid + yLabels + eixos + svgBars + limLine + '</svg>';

    // Tabela
    const tRows = dadosMeses.map(function(l,i){
      const cap = l?l.consumo_m3||0:0;
      const pctM = (l&&aut>0)?Math.round(cap/aut*100):null;
      const acima = l&&aut>0&&cap>aut;
      const bgRow = i%2?'#f9fafb':'#ffffff';
      const stCor = !l?'#9ca3af':acima?'#C62828':'#15803D';
      const stTxt = !l?'Sem dado':acima?'Acima':'Normal';
      const pctCor = pctM===null?'#9ca3af':pctM>100?'#C62828':pctM>80?'#E65100':'#15803D';
      return '<tr style="background:'+bgRow+';page-break-inside:avoid;">'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;">'+nomeMeses[i]+'/'+ano+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;font-family:monospace;text-align:right;">'+(l?l.leitura_anterior||0:'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;font-family:monospace;text-align:right;">'+(l?l.leitura_atual:'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;font-family:monospace;text-align:right;font-weight:600;">'+(l?cap.toFixed(1):'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;text-align:right;">'+(aut>0?aut.toFixed(1):'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;text-align:center;font-weight:700;color:'+pctCor+';">'+(pctM!==null?pctM+'%':'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;font-weight:600;color:'+stCor+';">'+stTxt+(l&&l.observacao?'<br><span style="font-size:9px;color:#6b7280;font-weight:400;">'+l.observacao+'</span>':'')+'</td>'
        +'</tr>';
    }).join('');

    // Resumo
    const sitGeral = mesesAcima>0?'apresentou extrapolação do limite em '+mesesAcima+' mês(es)':'manteve-se dentro do volume autorizado em todos os meses com registro';
    const resumo = 'No ano de '+ano+', o ponto <strong>'+u.descricao+'</strong> captou <strong>'+totalCap.toFixed(1)+' m³</strong>, equivalente a <strong>'+pct+'%</strong> do volume anual autorizado'+(autAnual>0?' de <strong>'+autAnual.toFixed(1)+' m³</strong>':'')
      +'. Dos 12 meses, <strong>'+mesesComDado+'</strong> possuem leitura registrada'+(mesesSemDado>0?', <strong>'+mesesSemDado+'</strong> sem dado':'')
      +'. O ponto '+sitGeral+'.';

    const nomeArq = c.nome.split(' ')[0]+'_'+u.descricao.replace(/[^a-zA-Z0-9]/g,'_')+(u.requerimento?'_'+u.requerimento:'')+'_'+ano;
    const w = window.open('','_blank');

    w.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>${nomeArq}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#111827;background:#fff;padding:0;}
  @media print{
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    .no-print{display:none!important;}
    body{padding:0;}
    .pagina{page-break-after:always;}
    .pagina:last-child{page-break-after:avoid;}
    tr{page-break-inside:avoid;}
  }
  .pagina{padding:24px 28px;max-width:860px;margin:0 auto;}
  .cab{background:linear-gradient(135deg,#1565C0 0%,#1976D2 60%,#2196F3 100%);padding:16px 20px;border-radius:8px;color:white;margin-bottom:14px;}
  .cab-titulo{font-size:15px;font-weight:700;letter-spacing:.3px;}
  .cab-sub{font-size:10px;opacity:.85;margin-top:3px;}
  .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;}
  .grid4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:8px;}
  .card-info{background:#f8faff;border:1px solid #dbeafe;border-radius:6px;padding:8px 10px;}
  .card-label{font-size:8.5px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;}
  .card-val{font-size:11.5px;font-weight:700;color:#111827;}
  .card-sub{font-size:9.5px;color:#6b7280;margin-top:1px;}
  .card-num{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:8px;text-align:center;}
  .card-num .val{font-size:20px;font-weight:800;color:#1D4ED8;font-family:monospace;}
  .card-num .lab{font-size:9px;color:#6b7280;margin-top:2px;}
  .card-pct-ok{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;padding:8px;text-align:center;}
  .card-pct-ok .val{font-size:20px;font-weight:800;color:#15803D;font-family:monospace;}
  .card-pct-warn{background:#FFEBEE;border:1px solid #FECACA;border-radius:6px;padding:8px;text-align:center;}
  .card-pct-warn .val{font-size:20px;font-weight:800;color:#C62828;font-family:monospace;}
  .card-pct-ok .lab,.card-pct-warn .lab{font-size:9px;color:#6b7280;margin-top:2px;}
  .sec-titulo{font-size:9.5px;font-weight:700;color:#1565C0;text-transform:uppercase;letter-spacing:.06em;margin:10px 0 6px;padding-bottom:3px;border-bottom:1.5px solid #BFDBFE;}
  .vazao-detalhe{background:#F0F9FF;border:1px solid #BFDBFE;border-radius:6px;padding:10px 14px;margin-bottom:8px;font-size:11px;color:#1E3A8A;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
  .vazao-detalhe .num{font-family:monospace;font-weight:700;font-size:13px;color:#1565C0;}
  .vazao-detalhe .op{color:#6b7280;font-size:13px;font-weight:300;}
  .vazao-detalhe .igual{color:#1565C0;font-weight:700;font-size:13px;}
  .vazao-detalhe .resultado{font-weight:800;font-family:monospace;font-size:14px;color:#1D4ED8;}
  .badge-tipo{display:inline-block;padding:2px 8px;border-radius:12px;font-size:9.5px;font-weight:700;letter-spacing:.03em;}
  .badge-outorga{background:#DBEAFE;color:#1E40AF;}
  .badge-dispensa{background:#FEF3C7;color:#92400E;}
  .badge-tamponamento{background:#F3E8FF;color:#6B21A8;}
  .foto-wrap{margin-bottom:8px;}
  .foto-label{font-size:8.5px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;font-weight:600;}
  .foto-img{width:100%;max-height:200px;object-fit:contain;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;display:block;}
  .graf-wrap{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;margin-bottom:8px;}
  .graf-title{font-size:8.5px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
  .pdf-link{display:inline-block;background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;padding:4px 10px;border-radius:4px;text-decoration:none;font-size:10px;font-weight:600;}
  table{width:100%;border-collapse:collapse;font-size:10.5px;}
  thead tr{background:#1565C0;}
  thead th{color:white;padding:6px 8px;text-align:left;font-weight:600;font-size:10px;border:1px solid #1565C0;}
  thead th:nth-child(2),thead th:nth-child(3),thead th:nth-child(4),thead th:nth-child(5){text-align:right;}
  thead th:nth-child(6){text-align:center;}
  .resumo{background:#F0F9FF;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;padding:8px 12px;margin-top:8px;font-size:10.5px;line-height:1.7;color:#374151;}
  .resumo-title{font-size:8.5px;font-weight:700;color:#1565C0;text-transform:uppercase;margin-bottom:4px;}

  /* Página 2 */
  .pag2-cab{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #1565C0;padding-bottom:10px;margin-bottom:18px;}
  .pag2-titulo{font-size:13px;font-weight:700;color:#1565C0;}
  .pag2-sub{font-size:10px;color:#6b7280;margin-top:2px;}
  .decl-box{background:#F8FAFC;border:1px solid #e5e7eb;border-radius:8px;padding:16px 18px;margin-bottom:20px;}
  .decl-title{font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;}
  .decl-texto{font-size:11px;color:#374151;line-height:2;}
  .local-data{display:flex;gap:16px;margin-bottom:40px;}
  .campo-linha{flex:1;}
  .campo-linha.pequeno{flex:0 0 160px;}
  .campo-label{font-size:9px;color:#6b7280;margin-bottom:3px;}
  .campo-border{border-bottom:1px solid #374151;padding-bottom:3px;font-size:11px;color:#374151;}
  .assinaturas{display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:12px;}
  .ass-bloco{text-align:center;}
  .ass-espaco{height:72px;}
  .ass-linha{border-top:1.5px solid #374151;padding-top:8px;}
  .ass-nome{font-size:11.5px;font-weight:700;}
  .ass-cargo{font-size:10px;color:#6b7280;margin-top:2px;}
  .nota-legal{background:#F8FAFC;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;margin-top:24px;font-size:9.5px;color:#374151;line-height:1.7;}
  .rodape{text-align:center;font-size:8.5px;color:#9ca3af;margin-top:12px;border-top:1px solid #f3f4f6;padding-top:8px;}
  .btn-print{display:inline-flex;align-items:center;gap:8px;background:#1565C0;color:white;border:none;border-radius:8px;padding:11px 28px;font-size:13px;font-weight:600;cursor:pointer;margin-top:16px;}
  .btn-print:hover{background:#1976D2;}
</style>
</head>
<body>

<!-- ═══ PÁGINA 1 ═══ -->
<div class="pagina">

  <div class="cab">
    <div class="cab-titulo">Zello Ambiental — Relatório Anual de Vazão ${ano}</div>
    <div class="cab-sub">${EMPRESA.eng} · ${EMPRESA.crea} · ${EMPRESA.tel} · ${EMPRESA.email}</div>
  </div>

  <!-- IDENTIFICAÇÃO (cliente / empreendimento / ponto) -->
  <div class="sec-titulo">Identificação</div>
  <div class="grid3">
    <div class="card-info">
      <div class="card-label">Cliente / Outorgado</div>
      <div class="card-val">${c.nome}</div>
      <div class="card-sub">${c.cpf_cnpj||''}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Empreendimento</div>
      <div class="card-val">${p.nome}</div>
      <div class="card-sub">${p.cidade||''}${p.estado?' - '+p.estado:''}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Ponto de captação</div>
      <div class="card-val">${u.descricao}</div>
      <div class="card-sub">${u.possui_hidrometro===false?'⚠ Sem hidrômetro':(u.numero_serie?'Hidrômetro: '+u.numero_serie:'Hidrômetro: —')}</div>
    </div>
  </div>

  <!-- DADOS DA OUTORGA / LICENÇA (etapa 3 completa) -->
  <div class="sec-titulo">Dados da outorga / licença</div>
  <div class="grid4">
    <div class="card-info">
      <div class="card-label">Tipo</div>
      <div class="card-val"><span class="badge-tipo badge-${u.tipo_outorga||'outorga'}">${tipoOutorgaTxt}</span></div>
    </div>
    <div class="card-info">
      <div class="card-label">Nº Portaria / Licença</div>
      <div class="card-val">${u.portaria||p.portaria||'—'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Processo / SEI</div>
      <div class="card-val">${u.processo||p.processo||'—'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Requerimento</div>
      <div class="card-val">${u.requerimento||'—'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Data de emissão</div>
      <div class="card-val">${dataEmissaoStr||'—'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Validade (anos)</div>
      <div class="card-val">${prazoAn||'—'}${prazoAn?' anos':''}</div>
    </div>
    <div class="card-info" ${vencInfo?`style="border-color:#FECACA;background:#FFFBEB;"`:''}>
      <div class="card-label">Situação</div>
      <div class="card-val">${vencBadge||'<span style="color:#9ca3af;font-weight:400;">Sem data</span>'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">PDF da outorga</div>
      <div class="card-val">${u.outorga_pdf_url?`<a class="pdf-link" href="${u.outorga_pdf_url}" target="_blank">📄 Abrir PDF</a>`:'<span style="color:#9ca3af;font-weight:400;">Não anexado</span>'}</div>
    </div>
  </div>

  <!-- DETALHAMENTO DA VAZÃO -->
  <div class="sec-titulo">Vazão outorgada (cálculo)</div>
  <div class="vazao-detalhe">
    <div><span class="num">${(u.vazao_m3h||0).toFixed(2)}</span> <span style="font-size:9px;color:#6b7280;">m³/h</span></div>
    <span class="op">×</span>
    <div><span class="num">${u.horas_uso_dia||0}</span> <span style="font-size:9px;color:#6b7280;">h/dia</span></div>
    <span class="op">×</span>
    <div><span class="num">${u.dias_uso_mes||0}</span> <span style="font-size:9px;color:#6b7280;">dias/mês</span></div>
    <span class="igual">=</span>
    <div><span class="resultado">${aut.toFixed(1)}</span> <span style="font-size:10px;color:#6b7280;">m³/mês</span></div>
    <span style="color:#6b7280;">|</span>
    <div><span style="font-size:9px;color:#6b7280;">Anual:</span> <span class="resultado">${autAnual.toFixed(1)}</span> <span style="font-size:9px;color:#6b7280;">m³/ano</span></div>
  </div>

  <!-- OPERACIONAL -->
  <div class="grid2">
    <div class="card-info">
      <div class="card-label">Responsável pela leitura</div>
      <div class="card-val" style="font-size:10.5px;">${respLeituraTxt}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Possui hidrômetro</div>
      <div class="card-val">${u.possui_hidrometro===false?'<span style="color:#E65100;">Não — sem medição</span>':'<span style="color:#15803D;">Sim</span>'+(u.numero_serie?' · '+u.numero_serie:'')}</div>
    </div>
  </div>

  <!-- CONSUMO ANUAL (resumo numérico) -->
  <div class="grid2" style="margin-top:8px;">
    <div class="card-num">
      <div class="val">${totalCap.toFixed(1)}</div>
      <div class="lab">m³ captados em ${ano}</div>
    </div>
    <div class="${pct>100?'card-pct-warn':'card-pct-ok'}">
      <div class="val">${pct}%</div>
      <div class="lab">da outorga anual utilizada</div>
    </div>
  </div>

  ${u.foto_equipamento_url?`<div class="foto-wrap" style="margin-top:8px;">
    <div class="foto-label">Foto do equipamento</div>
    <img class="foto-img" src="${u.foto_equipamento_url}" alt="Foto do hidrômetro"/>
  </div>`:''}

  <div class="graf-wrap">
    <div class="graf-title">Evolução mensal de captação (m³/mês)</div>
    ${svgGraf}
    ${aut>0?`<div style="display:flex;align-items:center;gap:16px;margin-top:6px;font-size:9px;color:#6b7280;flex-wrap:wrap;">
      <span style="display:flex;align-items:center;gap:4px;"><svg width="24" height="6" style="flex-shrink:0"><line x1="0" y1="3" x2="24" y2="3" stroke="#E65100" stroke-width="1.5" stroke-dasharray="4,3"/></svg> Limite outorga: ${aut.toFixed(1)} m³/mês</span>
      <span style="display:flex;align-items:center;gap:4px;"><svg width="10" height="8" style="flex-shrink:0"><rect width="10" height="8" fill="#1976D2" rx="1"/></svg> Dentro do limite</span>
      <span style="display:flex;align-items:center;gap:4px;"><svg width="10" height="8" style="flex-shrink:0"><rect width="10" height="8" fill="#C62828" rx="1"/></svg> Acima do limite</span>
      <span style="display:flex;align-items:center;gap:4px;"><svg width="10" height="8" style="flex-shrink:0"><rect width="10" height="8" fill="#d1d5db" rx="1"/></svg> Sem dado</span>
    </div>`:''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Mês</th>
        <th style="text-align:right;">Leit. ant.</th>
        <th style="text-align:right;">Leit. atual</th>
        <th style="text-align:right;">Captado (m³)</th>
        <th style="text-align:right;">Autorizado (m³)</th>
        <th style="text-align:center;">% utilizado</th>
        <th>Situação</th>
      </tr>
    </thead>
    <tbody>${tRows}</tbody>
  </table>

  <div class="resumo">
    <div class="resumo-title">Resumo de conformidade</div>
    ${resumo}
  </div>

</div>

<!-- ═══ PÁGINA 2 ═══ -->
<div class="pagina">

  <div class="pag2-cab">
    <div>
      <div class="pag2-titulo">Zello Ambiental — Relatório Anual de Vazão ${ano}</div>
      <div class="pag2-sub">${c.nome} · ${u.descricao} · Port. ${u.portaria||p.portaria||'—'}</div>
    </div>
    <div style="font-size:9px;color:#9ca3af;">Gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
  </div>

  <div class="decl-box">
    <div class="decl-title">Declaração de conformidade</div>
    <div class="decl-texto">Declaro que as informações contidas neste relatório são fidedignas aos dados coletados pelo sistema de monitoramento <strong>Zello Ambiental</strong>, referentes ao ano de <strong>${ano}</strong>, para o ponto de captação <strong>${u.descricao}</strong>, empreendimento <strong>${p.nome}</strong>, ${tipoOutorgaTxt.toLowerCase()} <strong>${u.portaria||p.portaria||'—'}</strong>, processo <strong>${u.processo||p.processo||'—'}</strong>${dataEmissaoStr?', emitida em <strong>'+dataEmissaoStr+'</strong>':''}${dataVencStr?' e válida até <strong>'+dataVencStr+'</strong>':''}.</div>
  </div>

  <div class="local-data">
    <div class="campo-linha">
      <div class="campo-label">Local</div>
      <div class="campo-border">${p.cidade||'___________________________'}${p.estado?' - '+p.estado:''}</div>
    </div>
    <div class="campo-linha pequeno">
      <div class="campo-label">Data</div>
      <div class="campo-border">____/____/________</div>
    </div>
  </div>

  <div class="assinaturas">
    <div class="ass-bloco">
      <div class="ass-espaco"></div>
      <div class="ass-linha">
        <div class="ass-nome">${EMPRESA.eng}</div>
        <div class="ass-cargo">${EMPRESA.crea}</div>
        <div class="ass-cargo">Responsável Técnico</div>
      </div>
    </div>
    <div class="ass-bloco">
      <div class="ass-espaco"></div>
      <div class="ass-linha">
        <div class="ass-nome">${c.nome}</div>
        <div class="ass-cargo">${c.cpf_cnpj?((c.cpf_cnpj.replace(/\D/g,'').length>11)?'CNPJ: ':'CPF: ')+c.cpf_cnpj:''}</div>
        <div class="ass-cargo">${(c.cpf_cnpj||'').replace(/\D/g,'').length>11?'Representante Legal / Outorgado':'Titular / Outorgado'}</div>
      </div>
    </div>
  </div>

  <div class="nota-legal">
    <strong>Nota Legal:</strong> Este relatório de vazão atende as Instruções Técnicas do SP Águas e as Portarias DAEE nº 5.578/2018, nº 5.579/2018 e nº 6.987/2018.
  </div>

  <div class="rodape">Documento gerado pelo sistema Zello Ambiental — Gestão Hídrica · ${EMPRESA.eng} · ${EMPRESA.crea} · ${EMPRESA.email}</div>

</div>

<div class="no-print" style="text-align:center;padding:20px;">
  <button class="btn-print" onclick="window.print()">🖨 Imprimir / Salvar PDF</button>
</div>

</body>
</html>`);
    w.document.close();
  }

  async function gerarRelatorioConsolidado() {
    const cid = document.getElementById('rel-cliente').value;
    const ano = document.getElementById('rel-ano').value || new Date().getFullYear();
    if (!cid) { alert('Selecione um cliente para gerar o relatório consolidado.'); return; }
    const c = clientes.find(function(cc){ return cc.id===cid; });
    const usosCliente = usos.filter(function(u){ return u.cliente_id===cid && u.possui_hidrometro; });
    if (!usosCliente.length) { alert('Este cliente não possui pontos com hidrômetro.'); return; }

    const usoIds = usosCliente.map(function(u){return u.id;}).join(',');
    const leitsAno = await api('leituras?uso_id=in.('+usoIds+')&mes_referencia=gte.'+ano+'-01&mes_referencia=lte.'+ano+'-12&select=*') || [];
    const nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const totalGeralCap = leitsAno.reduce(function(s,l){return s+(l.consumo_m3||0);},0);

    // ── Construir seções por ponto ──
    const secoes = usosCliente.map(function(u) {
      const p = propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      const aut = getAutorizadoUso(u);
      const dadosMeses = ['01','02','03','04','05','06','07','08','09','10','11','12'].map(function(m){
        const found = leitsAno.filter(function(l){return l.uso_id===u.id&&l.mes_referencia===ano+'-'+m;});
        return found.length?found[0]:null;
      });
      const totalCap = dadosMeses.reduce(function(s,l){return s+(l?l.consumo_m3||0:0);},0);
      const pct = aut>0?Math.round(totalCap/(aut*12)*100):0;
      const mesesAcima = dadosMeses.filter(function(l){return l&&aut>0&&l.consumo_m3>aut;}).length;
      const mesesComDado = dadosMeses.filter(function(l){return l;}).length;
      const sitGeral = mesesAcima>0?'apresentou extrapolação em <strong>'+mesesAcima+' mês(es)</strong>':'manteve-se dentro do volume autorizado';
      const resumoPonto = 'Em '+ano+', captou <strong>'+totalCap.toFixed(1)+' m³</strong> ('+pct+'% do anual autorizado'+(aut>0?' de '+(aut*12).toFixed(1)+' m³':'')+').'+
        ' Registros: <strong>'+mesesComDado+'/12</strong> meses. O ponto '+sitGeral+'.';

      // Gráfico SVG compacto
      const vals = dadosMeses.map(function(l){return l?l.consumo_m3||0:0;});
      const maxVal = Math.max.apply(null,vals.concat([aut||1]));
      const svgW=780; const svgH=100; const barUnit=svgW/12;
      const barW=Math.floor(barUnit*0.65);
      const svgBars = dadosMeses.map(function(l,i){
        const v=l?l.consumo_m3||0:0;
        const h=v>0?Math.max(Math.round(v/maxVal*(svgH-20)),3):0;
        const cor=!l?'#e5e7eb':(aut>0&&v>aut)?'#C62828':'#1976D2';
        const x=i*barUnit+(barUnit-barW)/2;
        return '<g>'
          +'<rect x="'+x.toFixed(1)+'" y="'+(svgH-20-h)+'" width="'+barW+'" height="'+h+'" fill="'+cor+'" rx="2"/>'
          +(v>0?'<text x="'+(x+barW/2).toFixed(1)+'" y="'+(svgH-20-h-3)+'" text-anchor="middle" font-size="7.5" fill="'+cor+'" font-weight="600">'+v.toFixed(0)+'</text>':'')
          +'<text x="'+(x+barW/2).toFixed(1)+'" y="'+(svgH-5)+'" text-anchor="middle" font-size="8" fill="#6b7280">'+nomeMeses[i]+'</text>'
          +'</g>';
      }).join('');
      const yLim=aut>0?svgH-20-Math.round(aut/maxVal*(svgH-20)):-1;
      const limLine=aut>0?'<line x1="0" y1="'+yLim+'" x2="'+svgW+'" y2="'+yLim+'" stroke="#E65100" stroke-width="1" stroke-dasharray="4,3"/><text x="'+svgW+'" y="'+(yLim-2)+'" text-anchor="end" font-size="7.5" fill="#E65100">'+aut.toFixed(0)+' m³</text>':'';
      const svgGraf='<svg width="'+svgW+'" height="'+svgH+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">'+svgBars+limLine+'</svg>';

      // Tabela
      const rows = dadosMeses.map(function(l,i){
        const cap=l?l.consumo_m3||0:0;
        const pctM=(l&&aut>0)?Math.round(cap/aut*100):null;
        const acima=l&&aut>0&&cap>aut;
        const bgRow=i%2?'#f9fafb':'#ffffff';
        const stCor=!l?'#9ca3af':acima?'#C62828':'#15803D';
        const pctCor=pctM===null?'#9ca3af':pctM>100?'#C62828':pctM>80?'#E65100':'#15803D';
        return '<tr style="background:'+bgRow+';">'
          +'<td>'+nomeMeses[i]+'/'+ano+'</td>'
          +'<td style="text-align:right;font-family:monospace;">'+(l?l.leitura_anterior||0:'—')+'</td>'
          +'<td style="text-align:right;font-family:monospace;">'+(l?l.leitura_atual:'—')+'</td>'
          +'<td style="text-align:right;font-family:monospace;font-weight:600;">'+(l?cap.toFixed(1):'—')+'</td>'
          +'<td style="text-align:right;">'+(aut>0?aut.toFixed(1):'—')+'</td>'
          +'<td style="text-align:center;font-weight:700;color:'+pctCor+';">'+(pctM!==null?pctM+'%':'—')+'</td>'
          +'<td style="font-weight:600;color:'+stCor+';">'+(!l?'Sem dado':acima?'Acima':'Normal')+'</td>'
          +'</tr>';
      }).join('');

      // Mapa tipos de outorga (mesmo do relatório individual)
      const tiposOutorga = { outorga: 'Outorga', dispensa: 'Dispensa de Outorga', tamponamento: 'Tamponamento e Desistência' };
      const tipoOutorgaTxt = tiposOutorga[u.tipo_outorga] || u.tipo_outorga || 'Outorga';

      // Vencimento da outorga deste ponto
      let vencHtml = '';
      let dataEmStr = '';
      if (u.data_emissao && u.prazo_anos) {
        const dEm = new Date(u.data_emissao);
        dataEmStr = dEm.toLocaleDateString('pt-BR');
        const dVenc = new Date(u.data_emissao);
        dVenc.setFullYear(dVenc.getFullYear() + parseInt(u.prazo_anos,10));
        const dias = Math.round((dVenc - new Date()) / (1000*60*60*24));
        const corV = dias < 0 ? '#C62828' : dias < 90 ? '#E65100' : '#15803D';
        const labelV = dias < 0 ? 'VENCIDA em ' + dVenc.toLocaleDateString('pt-BR') : dias < 90 ? 'Vence em ' + dVenc.toLocaleDateString('pt-BR') + ' (' + dias + 'd)' : 'Válida até ' + dVenc.toLocaleDateString('pt-BR');
        vencHtml = '<span style="color:' + corV + ';font-weight:600;font-size:9.5px;">' + labelV + '</span>';
      }

      const portariaP = u.portaria || (p && p.portaria) || '';
      const processoP = u.processo || (p && p.processo) || '';
      const autAnualP = aut * 12;

      return {html:
        '<div class="ponto-bloco">'
          +'<div class="ponto-header">'
            +'<div style="flex:1;">'
              +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">'
                +'<span class="ponto-nome">'+u.descricao+(u.numero_serie?' <span class="ponto-serie">'+u.numero_serie+'</span>':'')+'</span>'
                +'<span class="badge-tipo badge-'+(u.tipo_outorga||'outorga')+'">'+tipoOutorgaTxt+'</span>'
                +(u.outorga_pdf_url?'<a class="pdf-link-mini" href="'+u.outorga_pdf_url+'" target="_blank">📄 PDF</a>':'')
              +'</div>'
              +'<div class="ponto-sub">'+(p?p.nome:'')+(p&&p.cidade?' · '+p.cidade+(p.estado?' - '+p.estado:''):'')+'</div>'
              +'<div class="ponto-meta">'
                +(portariaP?'<span>📋 Port. '+portariaP+'</span>':'')
                +(processoP?'<span>📁 SEI '+processoP+'</span>':'')
                +(u.requerimento?'<span>📑 Req. '+u.requerimento+'</span>':'')
                +(dataEmStr?'<span>📅 Emit. '+dataEmStr+'</span>':'')
                +(u.prazo_anos?'<span>⏱ '+u.prazo_anos+' anos</span>':'')
                +(vencHtml?'<span>'+vencHtml+'</span>':'')
              +'</div>'
              +'<div class="vazao-mini">'
                +'<span class="num">'+(u.vazao_m3h||0).toFixed(2)+'</span> <span class="lab">m³/h</span>'
                +' <span class="op">×</span> '
                +'<span class="num">'+(u.horas_uso_dia||0)+'</span> <span class="lab">h/dia</span>'
                +' <span class="op">×</span> '
                +'<span class="num">'+(u.dias_uso_mes||0)+'</span> <span class="lab">dias/mês</span>'
                +' <span class="igual">=</span> '
                +'<span class="resultado">'+aut.toFixed(1)+'</span> <span class="lab">m³/mês</span>'
                +' <span style="color:#9ca3af;">|</span> '
                +'<span class="lab">Anual:</span> <span class="resultado">'+autAnualP.toFixed(1)+'</span> <span class="lab">m³/ano</span>'
              +'</div>'
            +'</div>'
            +'<div class="ponto-stats">'
              +'<div class="stat-box stat-azul"><div class="stat-val">'+totalCap.toFixed(0)+'</div><div class="stat-lab">m³ no ano</div></div>'
              +'<div class="stat-box '+(pct>100?'stat-vermelho':'stat-verde')+'"><div class="stat-val">'+pct+'%</div><div class="stat-lab">utilizado</div></div>'
            +'</div>'
          +'</div>'
          +'<div class="graf-box">'
            +'<div class="graf-title">Evolução mensal (m³)</div>'
            +svgGraf
          +'</div>'
          +'<table><thead><tr>'
            +'<th>Mês</th><th style="text-align:right">Leit. ant.</th><th style="text-align:right">Leit. atual</th>'
            +'<th style="text-align:right">Captado</th><th style="text-align:right">Autorizado</th>'
            +'<th style="text-align:center">%</th><th>Situação</th>'
          +'</tr></thead><tbody>'+rows+'</tbody></table>'
          +'<div class="resumo-ponto">'+resumoPonto+'</div>'
          +(mesesAcima>0?'<div class="alerta-acima">⚠ '+mesesAcima+' mês(es) com consumo acima do limite autorizado.</div>':'')
        +'</div>'
      };
    }).map(function(s){return s.html;}).join('');

    const nomeArq = c.nome.split(' ')[0]+'_Consolidado_'+ano;
    const w = window.open('','_blank');

    w.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>${nomeArq}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#111827;background:#fff;}
  @media print{
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    .no-print{display:none!important;}
    .ponto-bloco{page-break-inside:avoid;}
    tr{page-break-inside:avoid;}
  }
  .pagina{padding:22px 26px;max-width:880px;margin:0 auto;}
  .cab{background:linear-gradient(135deg,#1565C0,#1976D2,#2196F3);padding:14px 20px;border-radius:8px;color:white;margin-bottom:14px;}
  .cab-titulo{font-size:15px;font-weight:700;}
  .cab-sub{font-size:10px;opacity:.85;margin-top:2px;}
  .cliente-row{display:flex;align-items:center;justify-content:space-between;background:#f0f7ff;border:1px solid #BFDBFE;border-radius:8px;padding:10px 14px;margin-bottom:14px;}
  .cliente-nome{font-size:13px;font-weight:700;color:#1565C0;}
  .cliente-doc{font-size:10px;color:#6b7280;margin-top:2px;}
  .total-geral{text-align:center;}
  .total-geral .val{font-size:22px;font-weight:800;color:#1D4ED8;font-family:monospace;}
  .total-geral .lab{font-size:9px;color:#6b7280;}
  .ponto-bloco{border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;overflow:hidden;}
  .ponto-header{display:flex;align-items:center;justify-content:space-between;background:#f8faff;border-bottom:1px solid #e5e7eb;padding:10px 14px;}
  .ponto-nome{font-size:12px;font-weight:700;color:#1565C0;}
  .ponto-serie{font-family:monospace;font-size:10px;color:#6b7280;font-weight:400;}
  .ponto-sub{font-size:10px;color:#6b7280;margin-top:2px;}
  .ponto-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px;font-size:9.5px;color:#6b7280;}
  .ponto-meta span{white-space:nowrap;}
  .badge-tipo{padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700;letter-spacing:.03em;}
  .badge-outorga{background:#DBEAFE;color:#1E40AF;}
  .badge-dispensa{background:#FEF3C7;color:#92400E;}
  .badge-tamponamento{background:#F3E8FF;color:#6B21A8;}
  .pdf-link-mini{background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;padding:1px 6px;border-radius:3px;text-decoration:none;font-size:9px;font-weight:600;}
  .vazao-mini{margin-top:5px;font-size:10px;color:#1E3A8A;background:#F0F9FF;padding:5px 10px;border-radius:4px;display:flex;flex-wrap:wrap;align-items:center;gap:4px;}
  .vazao-mini .num{font-family:monospace;font-weight:700;color:#1565C0;font-size:11px;}
  .vazao-mini .op{color:#9ca3af;font-weight:300;}
  .vazao-mini .igual{color:#1565C0;font-weight:700;}
  .vazao-mini .resultado{font-family:monospace;font-weight:800;color:#1D4ED8;font-size:11px;}
  .vazao-mini .lab{font-size:9px;color:#6b7280;}
  .ponto-stats{display:flex;gap:8px;}
  .stat-box{border-radius:6px;padding:6px 12px;text-align:center;min-width:70px;}
  .stat-azul{background:#EFF6FF;border:1px solid #BFDBFE;}
  .stat-verde{background:#F0FDF4;border:1px solid #BBF7D0;}
  .stat-vermelho{background:#FFEBEE;border:1px solid #FECACA;}
  .stat-val{font-size:16px;font-weight:800;font-family:monospace;}
  .stat-azul .stat-val{color:#1D4ED8;}
  .stat-verde .stat-val{color:#15803D;}
  .stat-vermelho .stat-val{color:#C62828;}
  .stat-lab{font-size:8.5px;color:#6b7280;}
  .graf-box{padding:8px 12px;background:#fafafa;border-bottom:1px solid #f3f4f6;}
  .graf-title{font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:5px;letter-spacing:.04em;}
  table{width:100%;border-collapse:collapse;font-size:10px;}
  thead tr{background:#1565C0;}
  thead th{color:white;padding:5px 8px;font-weight:600;font-size:9.5px;border:1px solid #1565C0;}
  tbody td{padding:4px 8px;border:1px solid #f0f0f0;}
  .resumo-ponto{background:#F0F9FF;border-left:3px solid #1565C0;padding:8px 12px;font-size:10.5px;color:#374151;line-height:1.7;}
  .alerta-acima{background:#FFEBEE;padding:6px 12px;font-size:10px;color:#C62828;font-weight:600;}
  .separador{border:none;border-top:2px solid #e5e7eb;margin:14px 0;}

  /* Página assinaturas */
  .pag2-cab{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #1565C0;padding-bottom:10px;margin-bottom:18px;}
  .pag2-titulo{font-size:13px;font-weight:700;color:#1565C0;}
  .pag2-sub{font-size:10px;color:#6b7280;margin-top:2px;}
  .decl-box{background:#F8FAFC;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-bottom:20px;}
  .decl-title{font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;}
  .decl-texto{font-size:11px;color:#374151;line-height:2;}
  .local-data{display:flex;gap:16px;margin-bottom:40px;}
  .campo-linha{flex:1;} .campo-linha.pequeno{flex:0 0 160px;}
  .campo-label{font-size:9px;color:#6b7280;margin-bottom:3px;}
  .campo-border{border-bottom:1px solid #374151;padding-bottom:3px;font-size:11px;}
  .assinaturas{display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:12px;}
  .ass-bloco{text-align:center;}
  .ass-espaco{height:72px;}
  .ass-linha{border-top:1.5px solid #374151;padding-top:8px;}
  .ass-nome{font-size:11.5px;font-weight:700;}
  .ass-cargo{font-size:10px;color:#6b7280;margin-top:2px;}
  .nota-legal{background:#F8FAFC;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;margin-top:20px;font-size:9.5px;color:#374151;line-height:1.7;}
  .rodape{text-align:center;font-size:8.5px;color:#9ca3af;margin-top:10px;border-top:1px solid #f3f4f6;padding-top:8px;}
  .btn-print{display:inline-flex;align-items:center;gap:8px;background:#1565C0;color:white;border:none;border-radius:8px;padding:11px 28px;font-size:13px;font-weight:600;cursor:pointer;margin-top:16px;}
</style>
</head>
<body>

<!-- ═══ PÁGINA 1+ — DADOS ═══ -->
<div class="pagina">
  <div class="cab">
    <div class="cab-titulo">Zello Ambiental — Relatório Consolidado de Vazão ${ano}</div>
    <div class="cab-sub">${EMPRESA.eng} · ${EMPRESA.crea} · ${EMPRESA.tel} · ${EMPRESA.email}</div>
  </div>

  <div class="cliente-row">
    <div>
      <div class="cliente-nome">${c.nome}</div>
      <div class="cliente-doc">${c.cpf_cnpj||''}</div>
    </div>
    <div class="total-geral">
      <div class="val">${totalGeralCap.toFixed(0)}</div>
      <div class="lab">m³ total captado em ${ano}</div>
    </div>
  </div>

  ${secoes}
</div>

<!-- ═══ PÁGINA FINAL — ASSINATURAS ═══ -->
<div class="pagina" style="page-break-before:always;">
  <div class="pag2-cab">
    <div>
      <div class="pag2-titulo">Relatório Consolidado de Vazão ${ano}</div>
      <div class="pag2-sub">${c.nome} · ${usosCliente.length} ponto(s) de captação</div>
    </div>
    <div style="font-size:9px;color:#9ca3af;">Gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
  </div>

  <div class="decl-box">
    <div class="decl-title">Declaração de conformidade</div>
    <div class="decl-texto">Declaro que as informações contidas neste relatório consolidado são fidedignas aos dados coletados pelo sistema de monitoramento <strong>Zello Ambiental</strong>, referentes ao ano de <strong>${ano}</strong>, para os <strong>${usosCliente.length} ponto(s) de captação</strong> do cliente <strong>${c.nome}</strong>, conforme outorgas registradas no sistema.</div>
  </div>

  <div class="local-data">
    <div class="campo-linha">
      <div class="campo-label">Local</div>
      <div class="campo-border">_________________________________</div>
    </div>
    <div class="campo-linha pequeno">
      <div class="campo-label">Data</div>
      <div class="campo-border">____/____/________</div>
    </div>
  </div>

  <div class="assinaturas">
    <div class="ass-bloco">
      <div class="ass-espaco"></div>
      <div class="ass-linha">
        <div class="ass-nome">${EMPRESA.eng}</div>
        <div class="ass-cargo">${EMPRESA.crea}</div>
        <div class="ass-cargo">Responsável Técnico</div>
      </div>
    </div>
    <div class="ass-bloco">
      <div class="ass-espaco"></div>
      <div class="ass-linha">
        <div class="ass-nome">${c.nome}</div>
        <div class="ass-cargo">${c.cpf_cnpj?((c.cpf_cnpj.replace(/\D/g,'').length>11)?'CNPJ: ':'CPF: ')+c.cpf_cnpj:''}</div>
        <div class="ass-cargo">${(c.cpf_cnpj||'').replace(/\D/g,'').length>11?'Representante Legal / Outorgado':'Titular / Outorgado'}</div>
      </div>
    </div>
  </div>

  <div class="nota-legal">
    <strong>Nota Legal:</strong> Este relatório de vazão atende as Instruções Técnicas do SP Águas e as Portarias DAEE nº 5.578/2018, nº 5.579/2018 e nº 6.987/2018.
  </div>
  <div class="rodape">Documento gerado pelo sistema Zello Ambiental · ${EMPRESA.eng} · ${EMPRESA.crea} · ${EMPRESA.email}</div>
</div>

<div class="no-print" style="text-align:center;padding:20px;">
  <button class="btn-print" onclick="window.print()">🖨 Imprimir / Salvar PDF</button>
</div>

</body>
</html>`);
    w.document.close();
  }

  // =============================================
  // ALERTAS
  // =============================================
  function renderAlertasVenc() {
    const el = document.getElementById('alertas-venc');
    if (!el) return;
    const lista = propriedades.filter(function(p){const d=getDiasVenc(p); return d!==null && d/30<=6;});
    if (!lista.length) { el.innerHTML='<p style="font-size:12px;color:var(--text-muted)">Nenhuma outorga com vencimento próximo.</p>'; return; }
    el.innerHTML = lista.map(function(p){
      const c=clientes.find(function(cc){return cc.id===p.cliente_id;});
      const d=getDiasVenc(p); const cor=getCorVenc(d,false);
      // Encontra o uso âncora (vencendo primeiro) para puxar data_emissao + prazo
      const ussDaProp = usos.filter(function(u){return u.propriedade_id===p.id;});
      let usoAnc = null, dMin = null;
      ussDaProp.forEach(function(u){
        const dd = getDiasVencUso(u, p);
        if (dd === null) return;
        if (dMin === null || dd < dMin) { dMin = dd; usoAnc = u; }
      });
      const dataEmBase = (usoAnc && usoAnc.data_emissao) || p.data_emissao;
      const prazoBase = (usoAnc && usoAnc.prazo_anos) || p.prazo_anos;
      const venc = new Date(dataEmBase);
      venc.setFullYear(venc.getFullYear() + parseInt(prazoBase,10));
      const portariaBase = (usoAnc && usoAnc.portaria) || p.portaria || '';
      return '<div class="alert-row"><div class="alert-dot ad-warn">⚠</div><div style="flex:1"><div style="font-size:12px;">'+(c?c.nome:'')+' — '+p.nome+'</div><div style="font-size:10px;color:var(--text-hint)">'+portariaBase+' · Vence '+venc.toLocaleDateString('pt-BR')+'</div></div><button class="btn btn-sm btn-amber" onclick="toggleRenovProp(\''+p.id+'\',true)">Em renovação</button></div>';
    }).join('');
  }

  function renderAlertas7dias() {
    const el = document.getElementById('alertas-7dias');
    if (!el) return;
    const hoje=new Date(); const dia1=new Date(hoje.getFullYear(),hoje.getMonth(),1);
    const dias=Math.round((hoje-dia1)/(1000*60*60*24));
    if (dias<7) { el.innerHTML='<p style="font-size:12px;color:var(--text-muted)">Menos de 7 dias desde o início do mês.</p>'; return; }
    const usosComH=usos.filter(function(u){return u.possui_hidrometro;});
    const usosComL=new Set(leituras.map(function(l){return l.uso_id;}));
    const pend=usosComH.filter(function(u){return !usosComL.has(u.id);});
    if (!pend.length) { el.innerHTML='<p style="font-size:12px;color:var(--text-muted)">Todos enviaram! 🎉</p>'; return; }
    el.innerHTML = pend.map(function(u){
      const c=clientes.find(function(cc){return cc.id===u.cliente_id;});
      const p=propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      if (!c) return '';
      const fone=(c.telefone1||'').replace(/\D/g,'');
      const _req = u.requerimento ? '\n📋 Requerimento: ' + u.requerimento : '';
      const _ser = u.numero_serie ? '\n🔢 Hidrômetro: ' + u.numero_serie : '';
      const msg=encodeURIComponent(
        'Olá, ' + c.nome.split(' ')[0] + '!\n\n' +
        '*Zello Ambiental — Gestão da Água*\n' +
        'Atenção: sua leitura mensal ainda não foi registrada.\n\n' +
        '*Propriedade:* ' + (p?p.nome:'') + '\n' +
        '*Ponto:* ' + (u.descricao||'') + _req + _ser + '\n\n' +
        'Acesse o link para registrar:\n' + CLIENTE_URL + '?token=' + u.token + '\n\n' +
        'Em caso de dúvidas: ' + EMPRESA.eng + ' · ' + EMPRESA.tel
      );
      return '<div class="alert-row"><div class="alert-dot ad-danger">!</div><div style="flex:1"><div style="font-size:12px;">'+c.nome+' — '+(p?p.nome:'')+' — '+u.descricao+'</div><div style="font-size:10px;color:var(--text-hint)">'+c.telefone1+'</div></div><a href="https://wa.me/55'+fone+'?text='+msg+'" target="_blank" class="btn btn-sm btn-green">WhatsApp</a></div>';
    }).join('');
  }




  // =============================================
  // LIMPAR TODOS OS CLIENTES (TEMPORÁRIO — REMOVER APÓS TESTES)
  // =============================================
  async function limparTodosClientes() {
    if (!confirm('⚠️ ATENÇÃO! Isso vai apagar TODOS os clientes, propriedades, pontos e leituras. Confirma?')) return;
    if (!confirm('Tem certeza absoluta? Esta ação NÃO pode ser desfeita!')) return;
    const tabelas = ['leituras','contatos','notificacoes','usos','propriedades','clientes'];
    let erros = 0;
    for (let i = 0; i < tabelas.length; i++) {
      const t = tabelas[i];
      try {
        const r = await api(t + '?id=neq.00000000-0000-0000-0000-000000000000', 'DELETE', null, 'return=minimal');
        if (!r || !r.ok) erros++;
      } catch(e) { erros++; }
    }
    if (erros === 0) {
      await carregarDados();
      alert('✅ Todos os dados foram removidos.');
    } else {
      alert('⚠️ Alguns dados podem não ter sido removidos. Execute o SQL no Supabase:\n\nTRUNCATE TABLE leituras, contatos, notificacoes, usos, propriedades, clientes CASCADE;');
    }
  }

  // =============================================
  // IMPORTAR COMPLETO VIA EXCEL (Clientes + Propriedades + Pontos)
  // =============================================
  let dadosImport = { clientes: [], propriedades: [], pontos: [] };

  function abrirImportarExcel() {
    dadosImport = { clientes: [], propriedades: [], pontos: [] };
    document.getElementById('import-file').value = '';
    document.getElementById('import-preview').innerHTML = '';
    document.getElementById('btn-confirmar-import').style.display = 'none';
    abrirModal('ov-importar');
  }

  function baixarModeloImport() {
    // Download direto do arquivo hospedado no Supabase (com todas as validações)
    const url = 'https://evxolmfwblxtmudksmnt.supabase.co/storage/v1/object/public/documentos-zello/modelo_importacao_zello_completo%20(1).xlsx';
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_zello_completo.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
    if (typeof XLSX === 'undefined') { alert('Aguarde a biblioteca carregar e tente novamente.'); return; }
    const wb = XLSX.utils.book_new();

    // Aba 1 — Clientes
    const wsC = XLSX.utils.aoa_to_sheet([
      ['Nome completo *', 'CPF / CNPJ *', 'Telefone *', 'E-mail', 'Nome do representante', 'Papel do representante', 'Tel. do representante'],
      ['GUILHERME MONTANARI OLIVEIRA', '085.727.916-55', '(16) 98142-7633', 'guilherme@email.com', 'LAIS NEGRÃO', 'conjuge', '(16) 99798-3978'],
      ['FAZENDA ALTO PIRA LTDA', '12.345.678/0001-90', '(16) 93333-0000', '', '', '', '']
    ]);
    wsC['!cols'] = [{wch:35},{wch:22},{wch:18},{wch:30},{wch:30},{wch:22},{wch:18}];
    XLSX.utils.book_append_sheet(wb, wsC, '1_Clientes');

    // Aba 2 — Propriedades
    const wsP = XLSX.utils.aoa_to_sheet([
      ['CPF/CNPJ do cliente *', 'Nome do empreendimento *', 'Cidade *', 'Estado (UF) *', 'Portaria / Licença', 'Processo (SEI)', 'Data de emissão (DD/MM/AAAA)', 'Prazo (anos)', 'Tipo de outorga'],
      ['085.727.916-55', 'FAZENDA BELA VISTA', 'RIBEIRÃO PRETO', 'SP', '2690/2021', '9308460', '02/02/2021', 5, 'Outorga'],
      ['12.345.678/0001-90', 'SITIO SÃO PEDRO', 'SERTÃOZINHO', 'SP', '', '', '', '', 'Dispensa de Outorga']
    ]);
    wsP['!cols'] = [{wch:22},{wch:35},{wch:22},{wch:10},{wch:18},{wch:20},{wch:22},{wch:12},{wch:22}];
    XLSX.utils.book_append_sheet(wb, wsP, '2_Propriedades');

    // Aba 3 — Pontos
    const wsU = XLSX.utils.aoa_to_sheet([
      ['CPF/CNPJ do cliente *', 'Nome do empreendimento *', 'Descrição do ponto *', 'Tipo de outorga *', 'Requerimento', 'Vazão (m³/h)', 'Horas/dia', 'Dias/mês', 'Possui hidrômetro? (S/N)', 'Número de série', 'Responsável pela leitura (telefone)'],
      ['085.727.916-55', 'FAZENDA BELA VISTA', 'POÇO 1', 'Outorga', '20220000294-3BF', 10, 24, 31, 'S', 'D150H024739Z', '(16) 98142-7633'],
      ['12.345.678/0001-90', 'SITIO SÃO PEDRO', 'CAPTAÇÃO RIO', 'Dispensa de Outorga', '', 2, 8, 15, 'N', '', '']
    ]);
    wsU['!cols'] = [{wch:22},{wch:35},{wch:25},{wch:22},{wch:22},{wch:12},{wch:10},{wch:10},{wch:18},{wch:20},{wch:22}];
    XLSX.utils.book_append_sheet(wb, wsU, '3_Pontos');

    // Aba 4 — Papéis válidos
    const wsRef = XLSX.utils.aoa_to_sheet([
      ['Código (usar na coluna F)', 'Descrição'],
      ['conjuge', 'Cônjuge'], ['pai_mae', 'Pai / Mãe'], ['filho_filha', 'Filho / Filha'],
      ['irmao_irma', 'Irmão / Irmã'], ['gerente', 'Gerente / Responsável'],
      ['advogado', 'Advogado'], ['contador', 'Contador'], ['intermediador', 'Intermediador'], ['outro', 'Outro']
    ]);
    wsRef['!cols'] = [{wch:28},{wch:35}];
    XLSX.utils.book_append_sheet(wb, wsRef, 'Papéis válidos');

    XLSX.writeFile(wb, 'modelo_importacao_zello_completo.xlsx');
  }

  function previewImport(input) {
    if (!input.files || !input.files[0]) return;
    if (typeof XLSX === 'undefined') { alert('Aguarde a biblioteca carregar.'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        dadosImport = { clientes: [], propriedades: [], pontos: [] };

        function lerAba(nome, fallback) {
          return wb.Sheets[nome] || wb.Sheets[fallback] || null;
        }

        // Ler Clientes
        const wsC = lerAba('1_Clientes', wb.SheetNames[0]);
        if (wsC) {
          const rows = XLSX.utils.sheet_to_json(wsC, { header:1, defval:'', range:2 });
          dadosImport.clientes = rows.filter(function(r){ return String(r[0]||'').trim() && String(r[1]||'').trim(); }).map(function(r){
            return { nome:String(r[0]||'').trim().toUpperCase(), cpf_cnpj:String(r[1]||'').trim(), telefone1:String(r[2]||'').trim()||null, email:String(r[3]||'').trim()||null, rep_nome:String(r[4]||'').trim().toUpperCase()||null, rep_papel:String(r[5]||'').trim()||'outro', rep_tel:String(r[6]||'').trim()||null };
          });
        }

        // Ler Propriedades
        const wsP = lerAba('2_Propriedades', wb.SheetNames[1]);
        if (wsP) {
          const rows = XLSX.utils.sheet_to_json(wsP, { header:1, defval:'', range:2 });
          dadosImport.propriedades = rows.filter(function(r){ return String(r[0]||'').trim() && String(r[1]||'').trim(); }).map(function(r){
            const ds = String(r[6]||'').trim();
            let dataISO = null;
            if (ds && ds.includes('/')) { const p=ds.split('/'); if(p.length===3) dataISO=p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0'); }
            return { cpf_cnpj:String(r[0]||'').trim(), nome:String(r[1]||'').trim().toUpperCase(), cidade:String(r[2]||'').trim().toUpperCase()||null, estado:String(r[3]||'SP').trim().toUpperCase(), portaria:String(r[4]||'').trim()||null, processo:String(r[5]||'').trim()||null, data_emissao:dataISO, prazo_anos:parseInt(r[7])||null };
          });
        }

        // Ler Pontos
        const wsU = lerAba('3_Pontos', wb.SheetNames[2]);
        if (wsU) {
          const rows = XLSX.utils.sheet_to_json(wsU, { header:1, defval:'', range:2 });
          dadosImport.pontos = rows.filter(function(r){ return String(r[0]||'').trim() && String(r[1]||'').trim() && String(r[2]||'').trim(); }).map(function(r){
            const temH = String(r[8]||'S').trim().toUpperCase() !== 'N';
            return { cpf_cnpj:String(r[0]||'').trim(), prop_nome:String(r[1]||'').trim().toUpperCase(), descricao:String(r[2]||'').trim().toUpperCase(), tipo_outorga:String(r[3]||'outorga').trim().toLowerCase().replace('dispensa de outorga','dispensa').replace('tamponamento e desistência','tamponamento')||'outorga', requerimento:String(r[4]||'').trim().toUpperCase()||null, vazao_m3h:parseFloat(r[5])||null, horas_uso_dia:Math.min(parseFloat(r[6])||0,24)||null, dias_uso_mes:Math.min(parseInt(r[7])||0,31)||null, possui_hidrometro:temH, numero_serie:temH?(String(r[9]||'').trim().toUpperCase()||null):null, responsavel_tel:String(r[10]||'').trim()||null };
          });
        }

        const nC=dadosImport.clientes.length, nP=dadosImport.propriedades.length, nU=dadosImport.pontos.length;
        if (!nC && !nP && !nU) { document.getElementById('import-preview').innerHTML='<p style="color:#C62828;font-size:12px;">Nenhum dado válido encontrado. Use o modelo correto.</p>'; return; }

        let html = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">'
          +'<div style="background:#E3F2FD;border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#1565C0;">'+nC+'</div><div style="font-size:11px;color:#6b7280;">Clientes</div></div>'
          +'<div style="background:#E8F5E9;border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#2E7D32;">'+nP+'</div><div style="font-size:11px;color:#6b7280;">Propriedades</div></div>'
          +'<div style="background:#FFF3E0;border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#E65100;">'+nU+'</div><div style="font-size:11px;color:#6b7280;">Pontos</div></div>'
          +'</div>';
        if (nC) { html+='<div style="font-size:11px;font-weight:600;color:var(--blue);margin-bottom:4px;">CLIENTES</div><div style="border:1px solid var(--border);border-radius:6px;margin-bottom:10px;">'+dadosImport.clientes.map(function(d,i){return '<div style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:11px;'+(i%2?'background:#f9fafb':'')+'"><strong>'+d.nome+'</strong> · '+d.cpf_cnpj+(d.rep_nome?'<br/><span style="color:var(--text-muted);">👤 '+d.rep_nome+' ('+d.rep_papel+')</span>':'')+'</div>';}).join('')+'</div>'; }
        if (nP) { html+='<div style="font-size:11px;font-weight:600;color:#2E7D32;margin-bottom:4px;">PROPRIEDADES</div><div style="border:1px solid var(--border);border-radius:6px;margin-bottom:10px;">'+dadosImport.propriedades.map(function(d,i){return '<div style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:11px;'+(i%2?'background:#f9fafb':'')+'"><strong>'+d.nome+'</strong> · '+(d.cidade||'')+' - '+d.estado+(d.portaria?'<br/><span style="color:var(--text-muted);">Port. '+d.portaria+(d.processo?' · SEI: '+d.processo:'')+'</span>':'')+'</div>';}).join('')+'</div>'; }
        if (nU) { html+='<div style="font-size:11px;font-weight:600;color:#E65100;margin-bottom:4px;">PONTOS</div><div style="border:1px solid var(--border);border-radius:6px;">'+dadosImport.pontos.map(function(d,i){return '<div style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:11px;'+(i%2?'background:#f9fafb':'')+'"><strong>'+d.descricao+'</strong> · '+d.prop_nome+(d.numero_serie?'<br/><span style="color:var(--text-muted);">Hidrômetro: '+d.numero_serie+'</span>':'')+'</div>';}).join('')+'</div>'; }

        document.getElementById('import-preview').innerHTML = html;
        const btn = document.getElementById('btn-confirmar-import');
        btn.style.display = 'inline-flex';
        btn.textContent = '✓ Importar ' + nC + ' clientes, ' + nP + ' props, ' + nU + ' pontos';
      } catch(ex) {
        document.getElementById('import-preview').innerHTML = '<p style="color:#C62828;font-size:12px;">Erro ao ler: ' + ex.message + '</p>';
      }
    };
    reader.readAsArrayBuffer(input.files[0]);
  }

  async function confirmarImport() {
    const btn = document.getElementById('btn-confirmar-import');
    btn.disabled = true;
    let okC=0, okP=0, okU=0, erros=0;
    const mapCpf = {};    // cpf → cliente_id
    const mapProp = {};   // cpf||propNome → propriedade_id
    const detalhesErros = []; // detalhes de cada erro pra mostrar ao usuário

    // Helper interno: captura mensagem real do erro do Supabase
    async function lerErro(r, contexto) {
      try {
        const txt = await r.text();
        let msg = txt;
        try { const j = JSON.parse(txt); msg = j.message || j.error || j.hint || txt; } catch(_) {}
        return contexto + ': ' + (msg || ('HTTP ' + r.status));
      } catch(_) {
        return contexto + ': HTTP ' + (r ? r.status : '?');
      }
    }

    // 1. Clientes
    document.getElementById('import-preview').innerHTML = '<div style="font-size:12px;padding:8px;">⏳ Importando clientes...</div>';
    for (let i=0; i<dadosImport.clientes.length; i++) {
      const d = dadosImport.clientes[i];
      try {
        const r = await api('clientes','POST',{nome:d.nome,cpf_cnpj:d.cpf_cnpj,telefone1:d.telefone1,email:d.email,ativo:true,pin_hash:'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',portal_ativo:true},'return=representation');
        if (r&&r.ok) {
          const cd=await r.json(); const cid=cd[0]&&cd[0].id;
          if (cid) { mapCpf[d.cpf_cnpj]=cid; okC++;
            if (d.rep_nome) await api('contatos','POST',{cliente_id:cid,nome:d.rep_nome,papel:d.rep_papel,telefone:d.rep_tel,principal:true},'return=minimal');
          } else { erros++; detalhesErros.push('Cliente "'+d.nome+'": resposta sem ID'); }
        } else {
          erros++;
          detalhesErros.push(await lerErro(r, 'Cliente "'+d.nome+'" (CPF '+d.cpf_cnpj+')'));
        }
      } catch(e){
        erros++;
        detalhesErros.push('Cliente "'+d.nome+'": '+(e&&e.message||e));
      }
    }

    // 2. Propriedades
    document.getElementById('import-preview').innerHTML = '<div style="font-size:12px;padding:8px;">⏳ Importando propriedades...</div>';
    for (let i=0; i<dadosImport.propriedades.length; i++) {
      const d = dadosImport.propriedades[i];
      const cid = mapCpf[d.cpf_cnpj];
      if (!cid) {
        erros++;
        detalhesErros.push('Propriedade "'+d.nome+'": cliente CPF '+d.cpf_cnpj+' não encontrado (verifique se o CPF na aba Clientes é idêntico)');
        continue;
      }
      try {
        const r = await api('propriedades','POST',{cliente_id:cid,nome:d.nome,cidade:d.cidade,estado:d.estado,portaria:d.portaria,processo:d.processo,data_emissao:d.data_emissao,prazo_anos:d.prazo_anos,ativo:true},'return=representation');
        if (r&&r.ok) {
          const pd=await r.json(); const pid=pd[0]&&pd[0].id;
          if (pid) { mapProp[d.cpf_cnpj+'||'+d.nome]=pid; okP++; }
          else { erros++; detalhesErros.push('Propriedade "'+d.nome+'": resposta sem ID'); }
        } else {
          erros++;
          detalhesErros.push(await lerErro(r, 'Propriedade "'+d.nome+'"'));
        }
      } catch(e){
        erros++;
        detalhesErros.push('Propriedade "'+d.nome+'": '+(e&&e.message||e));
      }
    }

    // 3. Pontos
    document.getElementById('import-preview').innerHTML = '<div style="font-size:12px;padding:8px;">⏳ Importando pontos de captação...</div>';
    for (let i=0; i<dadosImport.pontos.length; i++) {
      const d = dadosImport.pontos[i];
      const cid = mapCpf[d.cpf_cnpj];
      const pid = mapProp[d.cpf_cnpj+'||'+d.prop_nome];
      if (!cid||!pid) {
        erros++;
        detalhesErros.push('Ponto "'+d.descricao+'": cliente ou propriedade não encontrados (CPF '+d.cpf_cnpj+', prop "'+d.prop_nome+'")');
        continue;
      }
      try {
        // Token UUID v4 — usa crypto.randomUUID quando disponível (mais seguro)
        const token = (typeof crypto!=='undefined'&&crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){const r=Math.random()*16|0;return(c=='x'?r:(r&0x3|0x8)).toString(16);});
        const r = await api('usos','POST',{propriedade_id:pid,cliente_id:cid,descricao:d.descricao,tipo_outorga:d.tipo_outorga,requerimento:d.requerimento,vazao_m3h:d.vazao_m3h,horas_uso_dia:d.horas_uso_dia,dias_uso_mes:d.dias_uso_mes,possui_hidrometro:d.possui_hidrometro,numero_serie:d.numero_serie,responsavel_tel:d.responsavel_tel,token:token,ativo:true},'return=minimal');
        if (r&&r.ok) okU++;
        else {
          erros++;
          detalhesErros.push(await lerErro(r, 'Ponto "'+d.descricao+'"'));
        }
      } catch(e){
        erros++;
        detalhesErros.push('Ponto "'+d.descricao+'": '+(e&&e.message||e));
      }
    }

    btn.disabled=false; btn.textContent='✓ Importar tudo';
    fecharModal('ov-importar');
    await carregarDados();

    // Monta mensagem final com detalhes dos erros (se houver)
    let msg = 'Importação concluída!\n\n✅ Clientes: '+okC+'\n✅ Propriedades: '+okP+'\n✅ Pontos: '+okU;
    if (erros>0) {
      msg += '\n\n❌ '+erros+' erro(s):\n\n';
      // Mostra até 10 erros pra não estourar o alert
      const mostrar = detalhesErros.slice(0, 10);
      msg += mostrar.map(function(e,i){return (i+1)+'. '+e;}).join('\n\n');
      if (detalhesErros.length > 10) msg += '\n\n...e mais '+(detalhesErros.length-10)+' erro(s). Veja o Console (F12) para a lista completa.';
      console.error('Erros completos da importação:', detalhesErros);
    }
    alert(msg);
  }


  // =============================================
  // EXCEL
  // =============================================
  function exportarExcel() {
    if (typeof XLSX === 'undefined') { alert('Aguarde a biblioteca carregar.'); return; }
    const wb = XLSX.utils.book_new();

    // ── Aba Clientes ──
    const wsC = XLSX.utils.json_to_sheet(clientes.map(function(c){
      return {
        Nome: c.nome,
        'CPF/CNPJ': c.cpf_cnpj || '',
        Telefone: c.telefone1 || '',
        Email: c.email || '',
        Ativo: c.ativo === false ? 'Não' : 'Sim'
      };
    }));
    XLSX.utils.book_append_sheet(wb, wsC, 'Clientes');

    // ── Aba Propriedades ──
    const wsP = XLSX.utils.json_to_sheet(propriedades.map(function(p){
      const c = clientes.find(function(cc){return cc.id===p.cliente_id;});
      return {
        Cliente: c ? c.nome : '',
        Empreendimento: p.nome,
        Cidade: p.cidade || '',
        Estado: p.estado || ''
      };
    }));
    XLSX.utils.book_append_sheet(wb, wsP, 'Propriedades');

    // ── Aba Pontos de Captação (com TODOS os campos da etapa 3) ──
    const tipos = { outorga: 'Outorga', dispensa: 'Dispensa', tamponamento: 'Tamponamento' };
    const wsU = XLSX.utils.json_to_sheet(usos.map(function(u){
      const c = clientes.find(function(cc){return cc.id===u.cliente_id;});
      const p = propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      const aut = getAutorizadoUso(u);
      // Calcula vencimento se houver data + prazo
      let vencStr = '';
      if (u.data_emissao && u.prazo_anos) {
        const dV = new Date(u.data_emissao);
        dV.setFullYear(dV.getFullYear() + parseInt(u.prazo_anos,10));
        vencStr = dV.toLocaleDateString('pt-BR');
      }
      const dataEmStr = u.data_emissao ? new Date(u.data_emissao).toLocaleDateString('pt-BR') : '';
      return {
        Cliente: c ? c.nome : '',
        Empreendimento: p ? p.nome : '',
        Ponto: u.descricao,
        Tipo: tipos[u.tipo_outorga] || u.tipo_outorga || '',
        Requerimento: u.requerimento || '',
        Portaria: u.portaria || '',
        Processo: u.processo || '',
        'Data Emissão': dataEmStr,
        'Validade (anos)': u.prazo_anos || '',
        Vencimento: vencStr,
        'Possui Hidrômetro': u.possui_hidrometro ? 'Sim' : 'Não',
        'Número Série': u.numero_serie || '',
        'Vazão m³/h': u.vazao_m3h || '',
        'Horas/Dia': u.horas_uso_dia || '',
        'Dias/Mês': u.dias_uso_mes || '',
        'Autorizado m³/mês': aut > 0 ? aut.toFixed(1) : '',
        'Autorizado m³/ano': aut > 0 ? (aut * 12).toFixed(1) : '',
        'Responsável Tel': u.responsavel_tel || '',
        'PDF Outorga': u.outorga_pdf_url || ''
      };
    }));
    XLSX.utils.book_append_sheet(wb, wsU, 'Pontos de Captacao');

    // ── Aba Contatos ──
    if (contatos && contatos.length) {
      const papeis = { responsavel_legal: 'Responsável Legal', tecnico: 'Técnico', encarregado: 'Encarregado', gerente: 'Gerente', proprietario: 'Proprietário', outro: 'Outro' };
      const wsCt = XLSX.utils.json_to_sheet(contatos.map(function(ct){
        const c = clientes.find(function(cc){return cc.id===ct.cliente_id;});
        return {
          Cliente: c ? c.nome : '',
          Nome: ct.nome,
          'CPF': ct.cpf_cnpj || '',
          Telefone: ct.telefone || '',
          Email: ct.email || '',
          Papel: papeis[ct.papel] || ct.papel || '',
          Principal: ct.principal ? 'Sim' : 'Não'
        };
      }));
      XLSX.utils.book_append_sheet(wb, wsCt, 'Contatos');
    }

    // ── Aba Leituras ──
    if (leituras && leituras.length) {
      const wsL = XLSX.utils.json_to_sheet(leituras.map(function(l){
        const u = usos.find(function(uu){return uu.id===l.uso_id;});
        const c = clientes.find(function(cc){return cc.id===l.cliente_id;});
        const p = u ? propriedades.find(function(pp){return pp.id===u.propriedade_id;}) : null;
        const aut = u ? getAutorizadoUso(u) : 0;
        const acima = aut > 0 && (l.consumo_m3||0) > aut;
        return {
          Cliente: c ? c.nome : '',
          Empreendimento: p ? p.nome : '',
          Ponto: u ? u.descricao : '',
          'Mês Referência': l.mes_referencia || '',
          'Leitura Anterior': l.leitura_anterior || 0,
          'Leitura Atual': l.leitura_atual || 0,
          'Consumo m³': l.consumo_m3 || 0,
          'Autorizado m³': aut > 0 ? aut.toFixed(1) : '',
          'Situação': aut > 0 ? (acima ? 'ACIMA' : 'Normal') : 'Sem limite',
          Observação: l.observacao || '',
          'Enviado em': l.enviado_em ? new Date(l.enviado_em).toLocaleString('pt-BR') : ''
        };
      }));
      XLSX.utils.book_append_sheet(wb, wsL, 'Leituras');
    }

    XLSX.writeFile(wb, 'Zello_Ambiental_' + new Date().toISOString().slice(0,10) + '.xlsx');
  }

  // =============================================
  // GRÁFICO
  // =============================================
  async function iniciarGrafico() {
    const ctx = document.getElementById('chartLine');
    if (!ctx) return;

    // Últimos 12 meses
    const n = new Date();
    const mesesRef = [], labels = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(n.getFullYear(), n.getMonth() - i, 1);
      const aaaa = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      mesesRef.push(aaaa + '-' + mm);
      labels.push(d.toLocaleDateString('pt-BR', {month: 'short', year: '2-digit'}));
    }

    // Total captado por mês (soma de todos os clientes)
    const dados = [];
    let totalGeral = 0, mesesComDado = 0;
    try {
      const mesInicio = mesesRef[0];
      const mesFim = mesesRef[mesesRef.length - 1];
      const todasLeits = await api('leituras?mes_referencia=gte.' + mesInicio + '&mes_referencia=lte.' + mesFim + '&select=mes_referencia,consumo_m3') || [];
      mesesRef.forEach(function(mes) {
        const leitsDoMes = todasLeits.filter(function(l) { return l.mes_referencia === mes; });
        if (leitsDoMes.length) {
          const total = leitsDoMes.reduce(function(s, l) { return s + (l.consumo_m3 || 0); }, 0);
          dados.push(parseFloat(total.toFixed(1)));
          totalGeral += total;
          mesesComDado++;
        } else {
          dados.push(null);
        }
      });
    } catch(e) { mesesRef.forEach(function() { dados.push(null); }); }

    // Mostrar total no rodapé
    const infoEl = document.getElementById('dash-chart-info');
    if (infoEl) {
      if (mesesComDado === 0) {
        infoEl.innerHTML = 'Sem dados nos últimos 12 meses.';
      } else {
        const media = totalGeral / mesesComDado;
        infoEl.innerHTML = '<strong>' + totalGeral.toFixed(1) + ' m³</strong> captados nos últimos ' + mesesComDado + ' meses · '
          + 'Média mensal: <strong>' + media.toFixed(1) + ' m³</strong>';
      }
    }

    if (window._chart) { window._chart.destroy(); window._chart = null; }

    if (typeof Chart === 'undefined') return;  // gracefully skip se Chart não carregou

    window._chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Volume captado (m³)',
          data: dados,
          borderColor: '#1565C0',
          backgroundColor: 'rgba(21,101,192,0.10)',
          borderWidth: 2.5,
          pointBackgroundColor: '#1565C0',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.35,
          spanGaps: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx) { return ctx.parsed.y !== null ? ctx.parsed.y.toFixed(1) + ' m³' : 'Sem dado'; }
            }
          }
        },
        scales: {
          y: { beginAtZero: true, min: 0, ticks: { callback: function(v) { return v + ' m³'; }, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }


  // =============================================
  // BUSCA GLOBAL
  // =============================================
  window._buscaAcoes = [];
  function buscaGlobal(q) {
    const el = document.getElementById('busca-resultados');
    if (!q || q.length < 2) { el.style.display = 'none'; return; }
    const ql = q.toLowerCase();
    const res = [];
    clientes.forEach(function(c) {
      if ((c.nome||'').toLowerCase().includes(ql)||(c.cpf_cnpj||'').includes(ql)) {
        const cid = c.id;
        res.push({tipo:'Cliente',icone:'👤',titulo:c.nome,sub:c.cpf_cnpj||'',acao:function(){fecharBusca();navTo('clientes',document.querySelector('.nav-item[onclick*=clientes]'));setTimeout(function(){verCliente(cid);},400);}});
      }
    });
    // Buscar por nome de contato/responsável legal
    contatos.forEach(function(ct) {
      if ((ct.nome||'').toLowerCase().includes(ql)||(ct.cpf||'').replace(/\D/g,'').includes(ql.replace(/\D/g,''))) {
        const c = clientes.find(function(cc){return cc.id===ct.cliente_id;});
        if (c) {
          const cid = c.id;
          const papelLabel = ct.papel==='responsavel_legal'?'Responsável legal':ct.papel;
          res.push({tipo:'Contato',icone:'👥',titulo:ct.nome,sub:c.nome+' · '+papelLabel,acao:function(){fecharBusca();navTo('clientes',document.querySelector('.nav-item[onclick*=clientes]'));setTimeout(function(){verCliente(cid);},400);}});
        }
      }
    });
    propriedades.forEach(function(p) {
      if ((p.nome||'').toLowerCase().includes(ql)||(p.portaria||'').toLowerCase().includes(ql)) {
        const cid = p.cliente_id;
        res.push({tipo:'Propriedade',icone:'🏡',titulo:p.nome,sub:(clientes.find(function(c){return c.id===cid;})||{}).nome||'',acao:function(){fecharBusca();navTo('clientes',document.querySelector('.nav-item[onclick*=clientes]'));setTimeout(function(){verCliente(cid);},400);}});
      }
    });
    usos.forEach(function(u) {
      if ((u.descricao||'').toLowerCase().includes(ql)||(u.requerimento||'').toLowerCase().includes(ql)||(u.numero_serie||'').toLowerCase().includes(ql)) {
        const cid = u.cliente_id;
        res.push({tipo:'Ponto',icone:'💧',titulo:u.descricao,sub:(clientes.find(function(c){return c.id===cid;})||{}).nome||'',acao:function(){fecharBusca();navTo('clientes',document.querySelector('.nav-item[onclick*=clientes]'));setTimeout(function(){verCliente(cid);},400);}});
      }
    });
    if (notificacoes) {
      notificacoes.forEach(function(n) {
        if ((n.observacao||'').toLowerCase().includes(ql)||(n.processo||'').toLowerCase().includes(ql)||(n.orgao||'').toLowerCase().includes(ql)) {
          res.push({tipo:'Notificação',icone:'🔔',titulo:n.orgao+' — '+n.tipo,sub:(clientes.find(function(c){return c.id===n.cliente_id;})||{}).nome||'',acao:function(){fecharBusca();navTo('notificacoes',document.querySelector('.nav-item[onclick*=notificacoes]'));}});
        }
      });
    }
    if (!res.length) { el.innerHTML='<div style="padding:14px;text-align:center;font-size:12px;color:var(--text-muted);">Nenhum resultado para "'+q+'"</div>'; el.style.display='block'; return; }
    window._buscaAcoes = res.slice(0,8).map(function(r){return r.acao;});
    var html = '';
    for (var bi=0; bi<window._buscaAcoes.length; bi++) {
      var br = res[bi];
      html += '<div onclick="window._buscaAcoes['+bi+']()" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f0f0f0;display:flex;gap:10px;align-items:center;" onmouseover="this.style.background=&#39;#f0f4ff&#39;" onmouseout="this.style.background=&#39;&#39;">'
           + '<span style="font-size:18px;">'+br.icone+'</span>'
           + '<div><div style="font-size:12px;font-weight:600;">'+br.titulo+'</div>'
           + '<div style="font-size:10px;color:#6b7280;">'+br.tipo+' · '+br.sub+'</div></div></div>';
    }
    if (res.length>8) html += '<div style="padding:8px;text-align:center;font-size:11px;color:#9ca3af;">+'+(res.length-8)+' resultados</div>';
    el.innerHTML = html;
    el.style.display='block';
  }
  function fecharBusca() {
    const bg=document.getElementById('busca-global'); if(bg) bg.value='';
    const br=document.getElementById('busca-resultados'); if(br) br.style.display='none';
  }
  document.addEventListener('click',function(e){
    const br=document.getElementById('busca-resultados');
    if(br&&!br.contains(e.target)&&e.target.id!=='busca-global') br.style.display='none';
  });

  // =============================================
  // CONFIGURAÇÕES DA EMPRESA
  // =============================================
  function carregarConfigEmpresa() {
    const campos=['nome','crea','tel','email','empresa'];
    campos.forEach(function(c){
      const salvo=localStorage.getItem('z_eng_'+c);
      const el=document.getElementById('cfg-eng-'+c);
      if(el&&salvo) el.value=salvo;
    });
    atualizarEmpresaGlobal();
  }
  function atualizarEmpresaGlobal() {
    const n=localStorage.getItem('z_eng_nome'), cr=localStorage.getItem('z_eng_crea'),
          t=localStorage.getItem('z_eng_tel'), em=localStorage.getItem('z_eng_email'),
          emp=localStorage.getItem('z_eng_empresa');
    if(n) EMPRESA.eng=n; if(cr) EMPRESA.crea=cr; if(t) EMPRESA.tel=t;
    if(em) EMPRESA.email=em; if(emp) EMPRESA.nome=emp;
    const sc=document.querySelector('.sidebar-contact');
    if(sc) sc.innerHTML=EMPRESA.eng+'<br>'+EMPRESA.crea+'<br><a href="tel:'+EMPRESA.tel+'">'+EMPRESA.tel+'</a><br><a href="mailto:'+EMPRESA.email+'">'+EMPRESA.email+'</a>';
  }
  function salvarConfigEmpresa() {
    const campos=['nome','crea','tel','email','empresa'];
    campos.forEach(function(c){
      const el=document.getElementById('cfg-eng-'+c);
      if(el&&el.value.trim()) localStorage.setItem('z_eng_'+c,el.value.trim());
    });
    atualizarEmpresaGlobal();
    alert('✅ Dados do responsável técnico salvos!\nAs alterações são aplicadas imediatamente.');
  }

  // =============================================
  // EXPORTAR EXCEL — TODOS OS CLIENTES
  // =============================================
  async function exportarRelatorioAnualTodos() {
    const ano = document.getElementById('rel-ano').value || new Date().getFullYear();
    if (!confirm('Exportar relatório de TODOS os clientes para '+ano+'?\nIsso pode levar alguns segundos.')) return;
    const leitsAno = await api('leituras?mes_referencia=gte.'+ano+'-01&mes_referencia=lte.'+ano+'-12&select=*') || [];
    const nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const wb = XLSX.utils.book_new();
    // Aba Resumo
    const resumoRows = [['Cliente','CPF/CNPJ','Propriedade','Ponto','Portaria','Requerimento','Autorizado m³/mês','Total captado m³','% anual','Meses c/ dado','Meses acima']];
    usos.filter(function(u){return u.possui_hidrometro;}).forEach(function(u){
      const c=clientes.find(function(cc){return cc.id===u.cliente_id;});
      const p=propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      const aut=getAutorizadoUso(u);
      const lu=leitsAno.filter(function(l){return l.uso_id===u.id;});
      const tot=lu.reduce(function(s,l){return s+(l.consumo_m3||0);},0);
      const pct=aut>0?Math.round(tot/(aut*12)*100):0;
      const ac=lu.filter(function(l){return aut>0&&l.consumo_m3>aut;}).length;
      resumoRows.push([c?c.nome:'',c?c.cpf_cnpj:'',p?p.nome:'',u.descricao,u.portaria||'',u.requerimento||'',aut>0?aut.toFixed(1):'',tot.toFixed(1),pct+'%',lu.length,ac]);
    });
    const wsR=XLSX.utils.aoa_to_sheet(resumoRows);
    wsR['!cols']=[{wch:30},{wch:18},{wch:25},{wch:20},{wch:15},{wch:20},{wch:16},{wch:16},{wch:10},{wch:13},{wch:12}];
    XLSX.utils.book_append_sheet(wb,wsR,'Resumo '+ano);
    // Aba Leituras detalhadas
    const detRows=[['Cliente','Ponto','Mês','Leit. ant.','Leit. atual','Consumo m³','Autorizado','% mês','Situação','Observação']];
    leitsAno.forEach(function(l){
      const u=usos.find(function(uu){return uu.id===l.uso_id;});
      const c=u?clientes.find(function(cc){return cc.id===u.cliente_id;}):null;
      const aut=u?getAutorizadoUso(u):0;
      const pctM=aut>0?Math.round((l.consumo_m3||0)/aut*100):0;
      const mes=l.mes_referencia?nomeMeses[parseInt(l.mes_referencia.split('-')[1])-1]+'/'+l.mes_referencia.split('-')[0]:'';
      detRows.push([c?c.nome:'',u?u.descricao:'',mes,l.leitura_anterior||0,l.leitura_atual||0,l.consumo_m3||0,aut>0?aut.toFixed(1):'',pctM+'%',aut>0&&l.consumo_m3>aut?'Acima':'Normal',l.observacao||'']);
    });
    const wsD=XLSX.utils.aoa_to_sheet(detRows);
    wsD['!cols']=[{wch:30},{wch:20},{wch:10},{wch:12},{wch:12},{wch:12},{wch:12},{wch:8},{wch:8},{wch:30}];
    XLSX.utils.book_append_sheet(wb,wsD,'Leituras '+ano);
    XLSX.writeFile(wb,'Zello_Ambiental_'+ano+'.xlsx');
    alert('✅ Exportado: Zello_Ambiental_'+ano+'.xlsx');
  }


  // =============================================
  // RESPONSÁVEL LEGAL (para empresas/CNPJ)
  // =============================================
  let _numRespLegais = 1;

  function detectarTipoCliente() {
    const doc = document.getElementById('c-doc').value.replace(/\D/g,'');
    const isCNPJ = doc.length > 11;
    const blocoLegal = document.getElementById('bloco-resp-legal');
    const labelContatos = document.getElementById('label-contatos-adicionais');
    if (isCNPJ) {
      blocoLegal.style.display = 'block';
      if (labelContatos) labelContatos.textContent = 'Outros contatos (opcional)';
      // Garantir pelo menos 1 responsável legal
      if (document.getElementById('lista-resp-legais').children.length === 0) {
        adicionarResponsavelLegal();
      }
    } else {
      blocoLegal.style.display = 'none';
      if (labelContatos) labelContatos.innerHTML = 'Contatos adicionais <span style="font-weight:400;font-size:10px;color:#6b7280;">(opcional)</span>';
    }
  }

  function adicionarResponsavelLegal() {
    const lista = document.getElementById('lista-resp-legais');
    const idx = lista.children.length;
    const div = document.createElement('div');
    div.className = 'resp-legal-item';
    div.style.cssText = 'background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:12px;margin-bottom:8px;position:relative;';
    div.innerHTML =
      (idx > 0 ? '<button onclick="this.parentElement.remove()" style="position:absolute;top:8px;right:8px;background:#fee2e2;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:11px;color:#C62828;">✕</button>' : '') +
      '<div class="g2">' +
        '<div class="fg span2"><label class="fl">Nome completo *</label><input class="fi upper" type="text" id="resp-legal-nome-'+idx+'" placeholder="Nome do responsável legal" /></div>' +
        '<div class="fg"><label class="fl">CPF *</label><input class="fi" type="text" id="resp-legal-cpf-'+idx+'" placeholder="000.000.000-00" maxlength="14" oninput="mascaraCpfCnpj(this)" /></div>' +
        '<div class="fg"><label class="fl">Telefone</label><input class="fi" type="tel" id="resp-legal-tel-'+idx+'" placeholder="(16) 99999-0000" maxlength="15" oninput="mascaraTel(this)" /></div>' +
        '<div class="fg span2"><label class="fl">E-mail</label><input class="fi" type="email" id="resp-legal-email-'+idx+'" placeholder="responsavel@empresa.com" /></div>' +
      '</div>';
    lista.appendChild(div);
    _numRespLegais = lista.children.length;
  }

  // (Versão duplicada de coletarResponsaveisLegais removida — a versão correta
  //  está mais acima e usa as chaves 'telefone' e 'principal' compatíveis com
  //  o salvamento dos contatos.)

  function limparResponsaveisLegais() {
    const lista = document.getElementById('lista-resp-legais');
    if (lista) lista.innerHTML = '';
    _numRespLegais = 1;
  }

  // =============================================
  // DOCUMENTOS / LICENÇAS
  // =============================================

  // Tipos de documentos suportados (extensível)
  const TIPOS_DOC = [
    { id: 'OUTORGA',     label: 'Outorga (DAEE/ANA)',          icone: '💧', cor: '#1565C0', bg: '#E3F2FD' },
    { id: 'CAR',         label: 'CAR — Cadastro Ambiental',    icone: '🌳', cor: '#2E7D32', bg: '#E8F5E9' },
    { id: 'CETESB',      label: 'CETESB — Licença Ambiental',  icone: '🏭', cor: '#E65100', bg: '#FFF3E0' },
    { id: 'DCAA',        label: 'DCAA — Declaração CETESB',    icone: '📄', cor: '#6A1B9A', bg: '#F3E5F5' },
    { id: 'CADRI',       label: 'CADRI — Movimentação Resíduos', icone: '♻️', cor: '#558B2F', bg: '#F1F8E9' },
    { id: 'PREFEITURA',  label: 'Alvará da Prefeitura',         icone: '🏛️', cor: '#5D4037', bg: '#EFEBE9' },
    { id: 'CCIR',        label: 'CCIR — INCRA',                 icone: '📋', cor: '#00695C', bg: '#E0F2F1' },
    { id: 'ITR',         label: 'ITR — Receita Federal',        icone: '💰', cor: '#827717', bg: '#F9FBE7' },
    { id: 'BOMBEIROS',   label: 'AVCB — Bombeiros',             icone: '🔥', cor: '#C62828', bg: '#FFEBEE' },
    { id: 'IPHAN',       label: 'IPHAN — Patrimônio',           icone: '🏺', cor: '#4527A0', bg: '#EDE7F6' },
    { id: 'DAEE',        label: 'Documento DAEE',               icone: '🌊', cor: '#0277BD', bg: '#E1F5FE' },
    { id: 'ANA',         label: 'Documento ANA',                icone: '💦', cor: '#01579B', bg: '#E0F7FA' },
    { id: 'IBAMA',       label: 'Licença IBAMA',                icone: '🦜', cor: '#33691E', bg: '#DCEDC8' },
    { id: 'OUTRO',       label: 'Outro',                        icone: '📎', cor: '#455A64', bg: '#ECEFF1' }
  ];
  function getTipoDoc(id) { return TIPOS_DOC.find(function(t){return t.id===id;}) || TIPOS_DOC[TIPOS_DOC.length-1]; }

  let _docsFiltro = 'todos';   // todos | vencidos | vencendo | emdia | semprazo
  let _docEditandoId = null;

  // Calcula status do documento baseado em data_vencimento
  function statusDoc(doc) {
    if (!doc.data_vencimento) {
      return { cls:'doc-status-semprazo', txt:'Sem prazo', cor:'#6b7280', bg:'#f3f4f6', dias:null };
    }
    const venc = new Date(doc.data_vencimento + 'T00:00:00');
    if (isNaN(venc.getTime())) return { cls:'doc-status-semprazo', txt:'Sem prazo', cor:'#6b7280', bg:'#f3f4f6', dias:null };
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const dias = Math.ceil((venc - hoje) / 86400000);
    if (dias < 0)    return { cls:'doc-status-vencido', txt:'Vencido há '+Math.abs(dias)+' dias', cor:'#C62828', bg:'#FFEBEE', dias };
    if (dias <= 30)  return { cls:'doc-status-critico', txt:'Vence em '+dias+' dias',  cor:'#C62828', bg:'#FFEBEE', dias };
    if (dias <= 90)  return { cls:'doc-status-aviso',   txt:'Vence em '+dias+' dias',  cor:'#E65100', bg:'#FFF3E0', dias };
    if (dias <= 180) return { cls:'doc-status-atento',  txt:'Vence em '+Math.ceil(dias/30)+' meses',  cor:'#F57F17', bg:'#FFF8E1', dias };
    return { cls:'doc-status-emdia', txt:'Em dia · '+Math.ceil(dias/30)+' meses', cor:'#2E7D32', bg:'#E8F5E9', dias };
  }

  // Atualiza badge do menu (qtde vencendo + vencidos)
  function atualizarBadgeDocs() {
    const badge = document.getElementById('badge-docs');
    if (!badge) return;
    const urgentes = (documentos||[]).filter(function(d){
      if (d.ativo === false) return false;
      const s = statusDoc(d);
      return s.dias !== null && s.dias <= 90;  // inclui vencidos (dias < 0)
    });
    if (urgentes.length > 0) {
      badge.textContent = String(urgentes.length);
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  // Popula selects de filtros
  function popularDocsSelects() {
    const selCli = document.getElementById('docs-filtro-cli');
    const selTipo = document.getElementById('docs-filtro-tipo');
    if (selCli) {
      const valor = selCli.value;
      selCli.innerHTML = '<option value="">Todos os clientes</option>' +
        clientes.slice().sort(function(a,b){return (a.nome||'').localeCompare(b.nome||'');}).map(function(c){
          return '<option value="'+c.id+'">'+(c.nome||'—')+'</option>';
        }).join('');
      selCli.value = valor;
    }
    if (selTipo) {
      const valor = selTipo.value;
      selTipo.innerHTML = '<option value="">Todos os tipos</option>' +
        TIPOS_DOC.map(function(t){return '<option value="'+t.id+'">'+t.icone+' '+t.label+'</option>';}).join('');
      selTipo.value = valor;
    }
  }

  function filtrarDocs(f) {
    _docsFiltro = f;
    ['todos','vencidos','vencendo','emdia','semprazo'].forEach(function(x){
      const b = document.getElementById('docs-filtro-'+x);
      if (b) { b.style.background = ''; b.style.color = ''; }
    });
    const ativo = document.getElementById('docs-filtro-'+f);
    if (ativo) { ativo.style.background = '#1565C0'; ativo.style.color = 'white'; }
    renderDocumentos();
  }

  // Render principal da lista de documentos
  function renderDocumentos() {
    const lista = document.getElementById('lista-documentos');
    const resumo = document.getElementById('docs-resumo');
    if (!lista) return;

    const buscaEl = document.getElementById('docs-busca');
    const busca = buscaEl ? (buscaEl.value || '').toLowerCase().trim() : '';
    const filtroCliEl = document.getElementById('docs-filtro-cli');
    const filtroTipoEl = document.getElementById('docs-filtro-tipo');
    const filtroCli = filtroCliEl ? filtroCliEl.value : '';
    const filtroTipo = filtroTipoEl ? filtroTipoEl.value : '';

    let docs = (documentos||[]).slice();

    if (filtroCli) docs = docs.filter(function(d){return d.cliente_id===filtroCli;});
    if (filtroTipo) docs = docs.filter(function(d){return d.tipo===filtroTipo;});

    if (_docsFiltro === 'vencidos') {
      docs = docs.filter(function(d){const s=statusDoc(d); return s.dias !== null && s.dias < 0;});
    } else if (_docsFiltro === 'vencendo') {
      docs = docs.filter(function(d){const s=statusDoc(d); return s.dias !== null && s.dias >= 0 && s.dias <= 90;});
    } else if (_docsFiltro === 'emdia') {
      docs = docs.filter(function(d){const s=statusDoc(d); return s.dias !== null && s.dias > 90;});
    } else if (_docsFiltro === 'semprazo') {
      docs = docs.filter(function(d){return !d.data_vencimento;});
    }

    if (busca) {
      docs = docs.filter(function(d){
        const c = clientes.find(function(cc){return cc.id===d.cliente_id;});
        const p = propriedades.find(function(pp){return pp.id===d.propriedade_id;});
        const tipo = getTipoDoc(d.tipo);
        const blob = [
          c?c.nome:'', p?p.nome:'', tipo.label, d.tipo, d.titulo, d.numero, d.orgao, d.processo, d.observacao
        ].filter(Boolean).join(' ').toLowerCase();
        return blob.indexOf(busca) >= 0;
      });
    }

    // Ordena: vencidos/vencendo primeiro
    docs.sort(function(a,b){
      const sa = statusDoc(a), sb = statusDoc(b);
      const da = sa.dias === null ? 99999 : sa.dias;
      const db = sb.dias === null ? 99999 : sb.dias;
      return da - db;
    });

    const total = (documentos||[]).length;
    const vencidos = (documentos||[]).filter(function(d){const s=statusDoc(d); return s.dias!==null && s.dias<0;}).length;
    const vencendo = (documentos||[]).filter(function(d){const s=statusDoc(d); return s.dias!==null && s.dias>=0 && s.dias<=90;}).length;
    if (resumo) {
      resumo.innerHTML = '<strong>'+total+'</strong> documento(s) cadastrado(s) · '
        + (vencidos>0 ? '<span style="color:#C62828;font-weight:600;">'+vencidos+' vencido(s)</span> · ' : '')
        + (vencendo>0 ? '<span style="color:#E65100;font-weight:600;">'+vencendo+' vencendo</span> · ' : '')
        + 'mostrando <strong>'+docs.length+'</strong>';
    }

    if (!docs.length) {
      lista.innerHTML = '<div class="card" style="text-align:center;padding:50px 20px;color:var(--text-muted);">'
        + '<div style="font-size:42px;margin-bottom:10px;opacity:0.4;">📄</div>'
        + '<div style="font-weight:600;margin-bottom:6px;">Nenhum documento encontrado</div>'
        + '<div style="font-size:12px;">' + (total === 0 ? 'Cadastre o primeiro documento clicando em "+ Novo documento"' : 'Tente ajustar os filtros acima') + '</div>'
        + '</div>';
      return;
    }

    lista.innerHTML = docs.map(function(d){ return renderCardDocumento(d); }).join('');
  }

  function renderCardDocumento(d) {
    const tipo = getTipoDoc(d.tipo);
    const c = clientes.find(function(cc){return cc.id===d.cliente_id;});
    const p = propriedades.find(function(pp){return pp.id===d.propriedade_id;});
    const u = usos.find(function(uu){return uu.id===d.uso_id;});
    const status = statusDoc(d);

    const escopo = [];
    if (c) escopo.push('👤 ' + (c.nome||''));
    if (p) escopo.push('🏡 ' + (p.nome||''));
    if (u) escopo.push('💧 ' + (u.descricao||''));

    const meta = [];
    if (d.numero) meta.push('Nº '+d.numero);
    if (d.orgao) meta.push(d.orgao);
    if (d.processo) meta.push('Proc. '+d.processo);
    if (d.data_emissao) meta.push('Emissão: '+formatarDataBrDoc(d.data_emissao));
    if (d.data_vencimento) meta.push('Vence: '+formatarDataBrDoc(d.data_vencimento));

    return '<div class="card" style="padding:14px;margin-bottom:10px;border-left:4px solid '+tipo.cor+';">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">'
      +   '<div style="flex:1;min-width:240px;">'
      +     '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">'
      +       '<span style="background:'+tipo.bg+';color:'+tipo.cor+';padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;">'+tipo.icone+' '+tipo.label+'</span>'
      +       '<span style="background:'+status.bg+';color:'+status.cor+';padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;">'+status.txt+'</span>'
      +     '</div>'
      +     '<div style="font-weight:700;font-size:14px;margin-bottom:4px;">'+escapeHtmlDoc(d.titulo || tipo.label)+'</div>'
      +     '<div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">'+escopo.join(' · ')+'</div>'
      +     (meta.length ? '<div style="font-size:11px;color:var(--text-muted);font-family:monospace;">'+meta.join(' · ')+'</div>' : '')
      +     (d.observacao ? '<div style="font-size:12px;color:var(--text);margin-top:6px;padding:6px 10px;background:#f9fafb;border-radius:6px;">'+escapeHtmlDoc(d.observacao)+'</div>' : '')
      +   '</div>'
      +   '<div style="display:flex;gap:6px;flex-shrink:0;">'
      +     (d.arquivo_url
        ? '<a href="'+d.arquivo_url+'" target="_blank" rel="noopener" class="btn btn-sm" style="background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;text-decoration:none;" title="Abrir arquivo">📄 Abrir</a>'
        : '<span class="btn btn-sm" style="background:#f3f4f6;color:#9ca3af;border:1px dashed #d1d5db;cursor:default;" title="Sem arquivo">📄 –</span>')
      +     '<button class="btn btn-sm" onclick="editarDocumento(\''+d.id+'\')" title="Editar">✏️</button>'
      +     '<button class="btn btn-sm btn-danger" onclick="excluirDocumento(\''+d.id+'\')" title="Excluir">🗑</button>'
      +   '</div>'
      + '</div>'
      + '</div>';
  }

  // Helpers locais (evitam conflito com nomes existentes)
  function escapeHtmlDoc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }
  function formatarDataBrDoc(iso) {
    if (!iso) return '—';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('pt-BR');
  }

  // ===========================================================
  // MODAL DE NOVO/EDITAR DOCUMENTO
  // ===========================================================
  function abrirNovoDocumento(prefill) {
    _docEditandoId = null;
    document.getElementById('doc-modal-titulo').textContent = '+ Novo documento';
    popularSelectsModalDoc();
    document.getElementById('doc-form-tipo').value = (prefill && prefill.tipo) || '';
    document.getElementById('doc-form-cliente').value = (prefill && prefill.cliente_id) || '';
    atualizarSelectsDocsDependentes();
    document.getElementById('doc-form-propriedade').value = (prefill && prefill.propriedade_id) || '';
    atualizarSelectUsosDoc();
    document.getElementById('doc-form-uso').value = (prefill && prefill.uso_id) || '';
    document.getElementById('doc-form-titulo').value = '';
    document.getElementById('doc-form-numero').value = '';
    document.getElementById('doc-form-orgao').value = '';
    document.getElementById('doc-form-processo').value = '';
    document.getElementById('doc-form-emissao').value = '';
    document.getElementById('doc-form-vencimento').value = '';
    document.getElementById('doc-form-obs').value = '';
    document.getElementById('doc-form-arquivo').value = '';
    document.getElementById('doc-form-arquivo-info').innerHTML = '';
    abrirModal('ov-documento');
  }

  function editarDocumento(id) {
    const d = (documentos||[]).find(function(x){return x.id===id;});
    if (!d) { alert('Documento não encontrado.'); return; }
    _docEditandoId = id;
    document.getElementById('doc-modal-titulo').textContent = '✏️ Editar documento';
    popularSelectsModalDoc();
    document.getElementById('doc-form-tipo').value = d.tipo || '';
    document.getElementById('doc-form-cliente').value = d.cliente_id || '';
    atualizarSelectsDocsDependentes();
    document.getElementById('doc-form-propriedade').value = d.propriedade_id || '';
    atualizarSelectUsosDoc();
    document.getElementById('doc-form-uso').value = d.uso_id || '';
    document.getElementById('doc-form-titulo').value = d.titulo || '';
    document.getElementById('doc-form-numero').value = d.numero || '';
    document.getElementById('doc-form-orgao').value = d.orgao || '';
    document.getElementById('doc-form-processo').value = d.processo || '';
    document.getElementById('doc-form-emissao').value = d.data_emissao || '';
    document.getElementById('doc-form-vencimento').value = d.data_vencimento || '';
    document.getElementById('doc-form-obs').value = d.observacao || '';
    document.getElementById('doc-form-arquivo').value = '';
    document.getElementById('doc-form-arquivo-info').innerHTML = d.arquivo_url
      ? '📄 <a href="'+d.arquivo_url+'" target="_blank" rel="noopener" style="color:#E65100;font-weight:600;">Ver arquivo atual</a> <span style="color:var(--text-muted);">— selecione um arquivo acima para substituir</span>'
      : '<span style="color:var(--text-muted);">Sem arquivo anexado</span>';
    abrirModal('ov-documento');
  }

  // Popula selects de Cliente e Tipo no modal
  function popularSelectsModalDoc() {
    const selCli = document.getElementById('doc-form-cliente');
    const selTipo = document.getElementById('doc-form-tipo');
    if (selCli) {
      selCli.innerHTML = '<option value="">— Selecione um cliente —</option>' +
        clientes.slice().sort(function(a,b){return (a.nome||'').localeCompare(b.nome||'');}).map(function(c){
          return '<option value="'+c.id+'">'+(c.nome||'—')+'</option>';
        }).join('');
    }
    if (selTipo) {
      selTipo.innerHTML = '<option value="">— Selecione o tipo —</option>' +
        TIPOS_DOC.map(function(t){return '<option value="'+t.id+'">'+t.icone+' '+t.label+'</option>';}).join('');
    }
  }

  function atualizarSelectsDocsDependentes() {
    const cid = document.getElementById('doc-form-cliente').value;
    const selProp = document.getElementById('doc-form-propriedade');
    selProp.innerHTML = '<option value="">— (opcional) propriedade —</option>';
    if (cid) {
      const props = propriedades.filter(function(p){return p.cliente_id===cid;});
      props.forEach(function(p){
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nome || '—';
        selProp.appendChild(opt);
      });
    }
    atualizarSelectUsosDoc();
  }

  function atualizarSelectUsosDoc() {
    const cid = document.getElementById('doc-form-cliente').value;
    const pid = document.getElementById('doc-form-propriedade').value;
    const selUso = document.getElementById('doc-form-uso');
    selUso.innerHTML = '<option value="">— (opcional) ponto/uso —</option>';
    if (cid) {
      let arr = usos.filter(function(u){return u.cliente_id===cid;});
      if (pid) arr = arr.filter(function(u){return u.propriedade_id===pid;});
      arr.forEach(function(u){
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.descricao || '—';
        selUso.appendChild(opt);
      });
    }
  }

  async function salvarDocumento() {
    const tipo = document.getElementById('doc-form-tipo').value;
    const cid = document.getElementById('doc-form-cliente').value;
    const pid = document.getElementById('doc-form-propriedade').value;
    const uid = document.getElementById('doc-form-uso').value;
    const titulo = document.getElementById('doc-form-titulo').value.trim();
    const numero = document.getElementById('doc-form-numero').value.trim();
    const orgao = document.getElementById('doc-form-orgao').value.trim();
    const processo = document.getElementById('doc-form-processo').value.trim();
    const emissao = document.getElementById('doc-form-emissao').value;
    const vencimento = document.getElementById('doc-form-vencimento').value;
    const obs = document.getElementById('doc-form-obs').value.trim();
    const fileInput = document.getElementById('doc-form-arquivo');

    if (!tipo) { alert('Selecione o tipo do documento.'); return; }
    if (!cid) { alert('Selecione o cliente.'); return; }
    if (emissao && vencimento && emissao > vencimento) {
      alert('A data de vencimento não pode ser anterior à data de emissão.');
      return;
    }

    const btn = document.getElementById('doc-btn-salvar');
    btn.disabled = true;
    btn.textContent = 'Salvando...';

    try {
      let arquivoUrl = null;
      let arquivoNome = null;

      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (file.size > 25 * 1024 * 1024) {
          alert('Arquivo muito grande (máx 25 MB).');
          btn.disabled = false; btn.textContent = '💾 Salvar';
          return;
        }
        btn.textContent = 'Enviando arquivo...';
        const ext = (file.name.split('.').pop() || 'pdf').replace(/[^a-zA-Z0-9]/g,'').toLowerCase() || 'pdf';
        const filename = 'doc-' + tipo.toLowerCase() + '-' + Date.now() + '.' + ext;
        const path = 'documentos/' + filename;
        const r = await fetch(SUPABASE_URL + '/storage/v1/object/documentos-zello/' + path, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': file.type || 'application/pdf'
          },
          body: file
        });
        if (!r.ok) {
          const t = await r.text().catch(function(){return '';});
          alert('Falha ao enviar arquivo. ' + t.substring(0,200));
          btn.disabled = false; btn.textContent = '💾 Salvar';
          return;
        }
        arquivoUrl = SUPABASE_URL + '/storage/v1/object/public/documentos-zello/' + path;
        arquivoNome = file.name;
        btn.textContent = 'Salvando...';
      }

      const payload = {
        cliente_id: cid,
        propriedade_id: pid || null,
        uso_id: uid || null,
        tipo: tipo,
        titulo: titulo || null,
        numero: numero || null,
        orgao: orgao || null,
        processo: processo || null,
        data_emissao: emissao || null,
        data_vencimento: vencimento || null,
        observacao: obs || null,
        ativo: true
      };
      if (arquivoUrl) {
        payload.arquivo_url = arquivoUrl;
        payload.arquivo_nome = arquivoNome;
      }

      let r;
      if (_docEditandoId) {
        r = await api('documentos?id=eq.'+_docEditandoId, 'PATCH', payload, 'return=minimal');
      } else {
        r = await api('documentos', 'POST', payload, 'return=minimal');
      }

      if (r && r.ok) {
        fecharModal('ov-documento');
        await carregarDados();
        renderDocumentos();
      } else {
        let txtErro = '';
        if (r) { try { txtErro = await r.text(); } catch(e){} }
        alert('Erro ao salvar documento.' + (txtErro ? '\n\n'+txtErro.substring(0,250) : ''));
      }
    } catch (e) {
      alert('Erro: ' + (e.message || e));
    } finally {
      btn.disabled = false;
      btn.textContent = '💾 Salvar';
    }
  }

  async function excluirDocumento(id) {
    const d = (documentos||[]).find(function(x){return x.id===id;});
    if (!d) return;
    const tipo = getTipoDoc(d.tipo);
    if (!confirm('Excluir este documento?\n\n' + tipo.label + (d.numero ? ' nº '+d.numero : '') + '\n\nEsta ação não pode ser desfeita. O arquivo continuará no Storage, mas o cadastro será removido.')) return;
    const r = await api('documentos?id=eq.'+id, 'DELETE', null, 'return=minimal');
    if (r && r.ok) {
      await carregarDados();
      renderDocumentos();
    } else {
      alert('Erro ao excluir documento.');
    }
  }

  // =============================================
  // NAVEGAÇÃO E MODAIS
  // =============================================
  const navTitles = { dashboard:'Dashboard', clientes:'Clientes', acompanhamento:'Acompanhamento de Vazões', leituras:'Leituras', documentos:'Documentos / Licenças', comunicados:'Comunicados', renovacoes:'Renovações de Outorga', alertas:'Alertas', relatorios:'Relatórios', config:'Configurações', notificacoes:'Notificações de Processos' };

  function navTo(id, el) {
    document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
    document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
    const page = document.getElementById('page-'+id); if (page) page.classList.add('active');
    if (el) el.classList.add('active');
    document.getElementById('topbarTitle').textContent = navTitles[id]||id;
    if (id==='renovacoes') renderRenovacoes();
    if (id==='acompanhamento') carregarAcompanhamento();
    if (id==='alertas') { renderAlertasVenc(); renderAlertas7dias(); atualizarStatusDisparoDia(); }
    if (id==='comunicados') { atualizarContagemDestinatarios(); }
    if (id==='notificacoes') { carregarNotificacoes(); }
    if (id==='leituras') { const n=new Date(); document.getElementById('filtro-mes').value=n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0'); carregarLeituras(); }
    if (id==='documentos') { popularDocsSelects(); renderDocumentos(); }
    if (id==='relatorios') popularSelectsRel();
    if (id==='config') { carregarConfigEmpresa(); testarConexaoConfig(); }
  }

  function abrirModal(id) { const el=document.getElementById(id); if(el) el.classList.add('open'); }
  function fecharModal(id) { const el=document.getElementById(id); if(el) el.classList.remove('open'); }
  function fecharSeClicar(e, id) { if(e.target===document.getElementById(id)) fecharModal(id); }

  // =============================================
  // DRAG & DROP DO MENU LATERAL
  // =============================================
  let _menuDraggingEl = null;

  function inicializarDragDropMenu() {
    const aside = document.querySelector('aside.sidebar nav');
    if (!aside) return;

    // Restaura ordem salva
    try {
      const ordemSalva = JSON.parse(localStorage.getItem('z_menu_ordem') || 'null');
      if (Array.isArray(ordemSalva) && ordemSalva.length) {
        aplicarOrdemMenu(ordemSalva);
      }
    } catch(e) { console.warn('[Zello] Falha ao restaurar ordem do menu:', e); }

    // Tornar todos os itens com data-page arrastáveis
    aside.querySelectorAll('.nav-item[data-page]').forEach(function(el){
      el.setAttribute('draggable', 'true');
    });

    aside.addEventListener('dragstart', function(e) {
      const item = e.target.closest('.nav-item[draggable="true"]');
      if (!item) return;
      _menuDraggingEl = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.dataset.page || '');
    });

    aside.addEventListener('dragend', function() {
      if (_menuDraggingEl) _menuDraggingEl.classList.remove('dragging');
      _menuDraggingEl = null;
      aside.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(function(el){
        el.classList.remove('drag-over-top','drag-over-bottom');
      });
    });

    aside.addEventListener('dragover', function(e) {
      const target = e.target.closest('.nav-item[draggable="true"]');
      if (!target || target === _menuDraggingEl) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      aside.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(function(el){
        if (el !== target) el.classList.remove('drag-over-top','drag-over-bottom');
      });
      const rect = target.getBoundingClientRect();
      const meio = rect.top + rect.height / 2;
      if (e.clientY < meio) {
        target.classList.add('drag-over-top');
        target.classList.remove('drag-over-bottom');
      } else {
        target.classList.add('drag-over-bottom');
        target.classList.remove('drag-over-top');
      }
    });

    aside.addEventListener('dragleave', function(e) {
      const target = e.target.closest('.nav-item[draggable="true"]');
      if (target) target.classList.remove('drag-over-top','drag-over-bottom');
    });

    aside.addEventListener('drop', function(e) {
      e.preventDefault();
      const target = e.target.closest('.nav-item[draggable="true"]');
      if (!target || !_menuDraggingEl || target === _menuDraggingEl) return;
      const rect = target.getBoundingClientRect();
      const meio = rect.top + rect.height / 2;
      if (e.clientY < meio) {
        target.parentNode.insertBefore(_menuDraggingEl, target);
      } else {
        target.parentNode.insertBefore(_menuDraggingEl, target.nextSibling);
      }
      target.classList.remove('drag-over-top','drag-over-bottom');
      salvarOrdemMenu();
    });
  }

  function salvarOrdemMenu() {
    const todos = document.querySelectorAll('aside.sidebar nav > *');
    const ordem = [];
    todos.forEach(function(el){
      if (el.classList.contains('nav-item') && el.dataset.page) {
        ordem.push({tipo: 'item', page: el.dataset.page});
      } else if (el.classList.contains('nav-label')) {
        ordem.push({tipo: 'label', txt: el.textContent});
      }
    });
    try { localStorage.setItem('z_menu_ordem', JSON.stringify(ordem)); } catch(e) {}
  }

  function aplicarOrdemMenu(ordem) {
    const nav = document.querySelector('aside.sidebar nav');
    if (!nav) return;
    const itensAtuais = {};
    nav.querySelectorAll('.nav-item[data-page]').forEach(function(el){
      itensAtuais[el.dataset.page] = el;
    });
    const labelsAtuais = [];
    nav.querySelectorAll('.nav-label').forEach(function(el){ labelsAtuais.push(el); });

    const novoFragmento = document.createDocumentFragment();
    const itensUsados = new Set();

    ordem.forEach(function(entry){
      if (entry.tipo === 'item' && itensAtuais[entry.page]) {
        novoFragmento.appendChild(itensAtuais[entry.page]);
        itensUsados.add(entry.page);
      } else if (entry.tipo === 'label') {
        const lab = labelsAtuais.find(function(l){
          return l.textContent.trim() === (entry.txt || '').trim() && !l._usado;
        });
        if (lab) {
          lab._usado = true;
          novoFragmento.appendChild(lab);
        }
      }
    });

    Object.keys(itensAtuais).forEach(function(k){
      if (!itensUsados.has(k)) novoFragmento.appendChild(itensAtuais[k]);
    });
    labelsAtuais.forEach(function(l){ delete l._usado; });

    nav.innerHTML = '';
    nav.appendChild(novoFragmento);
  }

  function resetarOrdemMenu() {
    if (!confirm('Restaurar ordem original do menu?')) return;
    try { localStorage.removeItem('z_menu_ordem'); } catch(e) {}
    location.reload();
  }

  function restaurarPendenciasConcluidas() {
    let conc = {};
    try { conc = JSON.parse(localStorage.getItem('z_pend_concluidos') || '{}'); } catch(e) {}
    const total = Object.keys(conc).length;
    if (total === 0) {
      alert('Nenhuma pendência marcada como concluída no momento.');
      return;
    }
    if (!confirm('🔄 Trazer de volta ' + total + ' pendência(s) marcada(s) como concluída(s)?\n\n(Notificações marcadas como respondidas no banco vão precisar ser reabertas manualmente em Notificações)')) return;
    try { localStorage.removeItem('z_pend_concluidos'); } catch(e) {}
    alert('✅ ' + total + ' pendência(s) restaurada(s) na lista. As que ainda fizerem sentido voltarão a aparecer no Dashboard.');
    if (typeof renderDashboard === 'function') renderDashboard();
  }

  // ============================================================
  // INICIALIZAÇÃO: verifica login antes de carregar tudo
  // ============================================================
  (async function inicializar(){
    const logado = await verificarLogin();
    if (!logado) {
      // Se não está logado, NÃO carrega os dados ainda. O login fará isso.
      return;
    }
    carregarDados();
    carregarTodasCidades();
    setTimeout(carregarConfigEmpresa, 500);
    setTimeout(inicializarDragDropMenu, 100);
  })();
