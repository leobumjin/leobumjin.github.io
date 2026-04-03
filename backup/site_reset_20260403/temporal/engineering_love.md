---
layout: distill
bibliography: all.bib
giscus_comments: false
disqus_comments: false
date: 2025-03-02
featured: true
img: assets/img/modeling_love.jpeg
title: 'Modeling Love (Emotion Machine)'
category: 'AI'
description: 'Mechanistic Approaches on Modeling Love, Emotion.'
_styles: >
    .table {
        padding-top:200px;
        margin-bottom: 2.5rem;
        border-bottom: 2px;
    }
    .p {
        font-size:20px;
    }
    .styled-image {
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin: 20px auto;
        transition: transform 0.3s ease;
        display: block;
    }
    .styled-image:hover {
    }

---


<p align="center" markdown="1">
Most of ideas comes from <strong>Emotion Machine</strong> (Minsky 2007) <br>
You can find 🇰🇷 Korean version in [here](/etc/engineering_love_kr) 
</p>


<img src="/assets/img/modeling_love.jpeg" width="70%" height="auto" class="styled-image"/>

## Modeling Love 

If you want to model love, you must first clearly understand its elements and processes. However, love is so ambiguous that it is difficult to discern its exact processes. Moreover, fully understanding the principles of something that exists externally rather than being created by us is impossible. For example, an automobile engineer can explain the functioning of a car in detail. But what if we show a fully assembled car to a child and ask them to guess how it works? The child might ride the car, disassemble some parts if necessary, and make various guesses. Despite these efforts, fully understanding the car would be difficult. Similarly, many concepts and objects that exist in the world are challenging to define clearly because we did not create them.

### “What is love?”

Many people experience love in their lives—love between family members, romantic love, or love for activities like play or academics. The following is a quote from Nobel Prize-winning physicist Richard Feynman during his lecture speech:

> “That was the beginning and the idea seemed so obvious to me that 1 fell deeply in love with it. And, like falling in love with a woman, it is only possible if you don't know too much about her, so you cannot see her faults. The faults wilt become apparent later, hut after the love is strong enough to hold you to her. So, I was held to this theory, in spite of all the difficulties, by my youthful enthusiasm.”

Feynman spoke about a love for knowledge, showing a commitment to it despite its flaws and challenges. The love he describes begins in a state of “ignorance,” where one does not initially see the flaws of the object of love. Even after recognizing them later, the emotional attachment remains. This illustrates how love shapes our attitudes and behaviors.

## The Broad Scope of Love and an Engineering Approach

Love is an emotion possessed by humans and, more broadly, living beings. Each individual forms love for certain objects in their own way. Because love is universal, it holds great power. However, from an engineering perspective, the ambiguity of its meaning makes it difficult to understand deeply or to implement directly.

For instance, imagine we had to make two people fall in love. If we could execute any action, what choices should we make? We would likely need to set many assumptions and draw upon our common knowledge to design such behaviors. For example, if one person’s sleeve is about to touch food during a meal, the other person naturally pulling it back might be considered an expression of love. But if we wanted to induce this behavior in a more fundamental way rather than through labeling all actions, how would we do it?

The answer lies in the design of the brain or body. By understanding how the human brain and body operate, we can induce behaviors associated with love by creating specific brain states. But what is the “brain state” that generates love?


## Brain States and the Formation of Love

What is a brain state? Our thoughts function as electrical signals transmitted between neurons through synapses. Alongside electrical signals, biological and physiological states change continuously, driving our thoughts and behaviors.
Various perspectives on states indicate that there are multiple ways emotions function. For example, a person might feel good for the following reasons:

1. The brain’s electrical signals activate positive neurons.
2. Beneficial hormones are secreted, enhancing emotions.

Marvin Minsky, in The Emotion Machine, described emotional states as processes of activating and deactivating specific brain resources:
> Each of our major "emotional states" results from turning certain resources on while turning certain others off—and thus changing some ways that our brains behave.

This concept is similar to traditional computing. In a binary “on/off” manner, the brain determines which resources to use, and emotions represent specific patterns of activation. If we understand these patterns, we could model emotions and create an Emotion Machine.

## Love is a Special Emotion

Unlike other emotions, love has the unique property of accepting its object unconditionally. As mentioned earlier, when we fall in love, we do not initially see the flaws of the object of our affection. Even when we do recognize them later, we tend to maintain our love. Shakespeare described this in Sonnet 141:

>“Truly, I do not love you with my eyes, For they see a thousand flaws in you. But my heart loves even what my eyes despise.”

This means that while the eyes see flaws, the heart continues to love despite them. Love is an emotion of acceptance, overriding rational judgment.

One way to explain this structure is through the Critic-Selector Based Machine. Traditional rule-based reaction machines respond to specific inputs using an if-then approach. In contrast, the Critic-Selector model separates evaluation (Critic) from decision-making (Selector). This is different from animals, which react instinctively to stimuli, as it mirrors how humans choose behaviors based on needs and desires even in the same situation.

<img src="https://d2acbkrrljl37x.cloudfront.net/bumjini-blog/research_cognitive_science/emotion-machine-love.png" width="90%" height="auto" class="styled-image"/>


Some interpret human decision-making purely from a reinforcement learning (RL) perspective, arguing that humans are merely animals optimizing long-term rewards. However, I believe that the human ability to “consider the future” has evolved beyond simple reward maximization to include the crucial function of choice. The future is full of uncertainty, and in situations where the right answer is unknown, freedom of choice is essential. This idea aligns with the resource-rational analysis argument, which states that human cognitive resources are always limited (Lieder 2020).

## Can We Model Love?

Modeling love involves filtering out an object’s various flaws or transforming them into positive attributes. Moreover, love is not just a fleeting emotion—it must persist over time. But what if love does not last? Or what if the emotional connection is formed incorrectly? As we see in reality, love often fades over time. We could analyze this process more objectively and, if we wished to maintain or strengthen love, design external mechanisms to reinforce those connections continuously.

Ultimately, engineering love means designing specific brain states. By doing so, we could create love that is both enduring and profound.


## Reference 


- Minsky, M. (2007). The emotion machine: Commonsense thinking, artificial intelligence, and the future of the human mind. Simon and Schuster.

- Lieder, F., & Griffiths, T. L. (2020). Resource-rational analysis: Understanding human cognition as the optimal use of limited computational resources. Behavioral and brain sciences, 43, e1.