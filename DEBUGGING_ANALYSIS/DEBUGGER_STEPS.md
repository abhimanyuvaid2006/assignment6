# Debugger Steps

## Breakpoint 1 - Before saving score

This breakpoint stops the code right before the score is saved.

At this point I can see:
username - the name entered by the user
score - the calculated score from the quiz

When I press Step Over, the score gets passed into saveScore() and is stored in localStorage.
This is what I expected because the function should save the user's results.



## Breakpoint 2 - After fetching questions

This breakpoint stops when the API returns data.

At this point I can see:
data - the full response from the API
data.results - the list of trivia questions

When I press Step Over, the questions are passed into displayQuestions().
This is correct because the app should now show the questions on the page.



## Breakpoint 3 - Updating the page

This breakpoint stops when a question is being added to the page.

At this point I can see:
question - the current question object
questionDiv - the element being created

When I press Step Over, the question gets added to the page.
I can see the question appear on the screen. This is correct because each question should be displayed.



## Critical State

I picked Breakpoint 2 to look at closer.

This tells me if the API call worked. If data.results is empty or undefined, something went wrong.
In my test, data.results had questions, so the API call worked correctly.

This matters because the next step (displayQuestions) only works if there is data.
If there was no data, the page would not show any questions.
